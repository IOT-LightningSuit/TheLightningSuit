using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using LightningSuitServer.Entities;

namespace LightningSuitServer.Services
{
    public class ExerciseService : BackgroundService
    {
        private Exercise currentExercise;

        private readonly List<Tuple<string, Exercise>> _exercises;
        private readonly SnapShot _snap;
        private readonly CurrentExercise _curr;
        public ExerciseService(SnapShot snap, CurrentExercise curr)
        {
            _snap = snap;
            _curr = curr;
            _exercises = new List<Tuple<string, Exercise>>();

            Exercise squat = new Exercise();
            squat.SetJoint(0, 90, 180, "Straighten your back!");
            squat.SetJoint(1, 90, 180, "Raise your right arm!");
            squat.SetJoint(2, 90, 180, "Raise tour left arm!");
            squat.SetJoint(3, 90, 180, "");
            squat.SetJoint(4, 90, 180, "");
            squat.SetJoint(5, 90, 180, "");
            squat.SetJoint(6, 90, 180, "");
            _exercises.Add(Tuple.Create("Squat", squat));

            Exercise shoulderPress = new Exercise();
            shoulderPress.SetJoint(0, 0, 0, "Keep your elbow straight!");
            shoulderPress.SetJoint(1, 180, 0, "Raise your left arm!");
            shoulderPress.SetJoint(2, 0, 0, "Keep your elbow straight!");
            shoulderPress.SetJoint(3, -180, 0, "Raise your left arm!");
            shoulderPress.SetJoint(4, 0, 0, "Keep your legs straight!");
            shoulderPress.SetJoint(5, 0, 0, "Keep your legs straight!");
            shoulderPress.SetJoint(6, 0, 0, "Keep your legs straight!");
            _exercises.Add(Tuple.Create("ShoulderPress", shoulderPress));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {   
                currentExercise = _exercises.Find(x => x.Item1 == _curr.CurrentEx)?.Item2;

                // Reset the remark to see if there are any errors during the exercise
                _snap.Remark = string.Empty;
                for (int i = 0; i < currentExercise.joints.Length; i++)
                {
                    if (currentExercise.joints[i].startAngleX > _snap.BodyAngles[i] ||
                            currentExercise.joints[i].endAngleX < _snap.BodyAngles[i])
                    {
                        _snap.Remark = currentExercise.joints[i].errorMessage;
                    }
                }

                if (string.IsNullOrEmpty(_snap.Remark))
                {
                    _snap.Remark = "Good Job!";
                }

                await Task.Delay(1000);
            }
            
        }
    }
}