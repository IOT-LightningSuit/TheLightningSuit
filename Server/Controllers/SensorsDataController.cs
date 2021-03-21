using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using LightningSuitServer.Entities;
using LightningSuitServer.Repository;
using System.Threading.Tasks;

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
        public int Get([FromRoute] string userName, [FromRoute] int result)
        {
            Console.ForegroundColor = ConsoleColor.Blue;
            if (result == 101)
            {
                Console.WriteLine($"{userName} logged on!");
                _writer.AddUser(userName);
                return 0;
            }

            Console.WriteLine($"{userName} has finished his workout with a score of {result}!");
            _writer.AddResult(userName, result);

            var sum = 0;
            var results = _writer.GetResults(userName);
            foreach (var res in results)
                sum += res;
            if (results.Count == 0)
                return 0;
            return sum / results.Count;
        }

        [HttpPost]
        public async void Post()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = reader.ReadToEndAsync();
                ParseAndAdd(body.Result);
            }
            catch (Exception)
            { /* */ }
        }

        private void ParseAndAdd(string message)
        {
            Console.ForegroundColor = ConsoleColor.White;
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
                if (sensor == 1 || sensor == 5) _snap.Change(sensor, yValue);
                //else if (sensor == 3 || sensor == 4) _snap.Change(sensor, zValue);
                else _snap.Change(sensor, xValue);
            }
        }
    }
}
