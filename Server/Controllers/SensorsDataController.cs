using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LightningSuitServer.Entities;
using LightningSuitServer.Repository;

namespace LightningSuitServer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SensorsDataController : ControllerBase
    {
        private readonly SnapShot _snap;
        private readonly CurrentExercise _curr;
        private readonly MongoWriter _writer;

        public SensorsDataController(SnapShot snap, CurrentExercise curr, MongoWriter writer)
        {
            _snap = snap;
            _curr = curr;
            _writer = writer;
        }

        [HttpGet("{currentExercise}")]
        public IEnumerable<SnapShot> Get([FromRoute] string currentExercise)
        {
            _curr.CurrentEx = currentExercise;
            return Enumerable.Range(1, 1).Select(i => _snap).ToArray();
        }

        [HttpGet("{userName}/{result}")]
        public List<int> Get(string userName, int result)
        {
            if (result == -1)
            {
                _writer.AddUser(userName);
                return _writer.GetResults(userName);
            }

            _writer.AddResult(userName, result);
            return _writer.GetResults(userName);
        }

        [HttpPost]
        public async void Post()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                ParseAndAdd(body);
            }
            catch (Exception)
            { /* */ }
        }

        private void ParseAndAdd(string message)
        {
            var sIndex = message.IndexOf('S');
            var xIndex = message.IndexOf('X');
            var yIndex = message.IndexOf('Y');
            var zIndex = message.IndexOf('Z');
            var eIndex = message.IndexOf('E');

            if (sIndex != -1 && xIndex != -1 && yIndex != -1 && zIndex != -1 && eIndex != -1)
            {
                int tempInt, sensor = 0;
                float tempFloat, xValue, yValue, zValue = 0;
                if (!int.TryParse(message.Substring(sIndex + 1, xIndex - sIndex - 1), out tempInt))
                    return;
                sensor = tempInt;
                if (!float.TryParse(message.Substring(xIndex + 1, yIndex - xIndex - 1), out tempFloat))
                    return;
                xValue = tempFloat;
                if (!float.TryParse(message.Substring(yIndex + 1, zIndex - yIndex - 1), out tempFloat))
                    return;
                yValue = tempFloat;
                if (!float.TryParse(message.Substring(zIndex + 1, eIndex - zIndex - 1), out tempFloat))
                    return;
                zValue = tempFloat;

                Console.WriteLine(message);
                _snap.Change(sensor, xValue);
            }
        }
    }
}
