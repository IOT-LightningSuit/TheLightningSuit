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
            squat.SetJoint(0, 90, 90, "Keep your hands straight forward!", "Keep your hands straight forward!", true);
            squat.SetJoint(1, 90, 180, "Raise your right arm!","", true);
            squat.SetJoint(2, 90, 180, "Raise tour left arm!","", true);
            squat.SetJoint(3, 90, 180, "", "", true);
            squat.SetJoint(4, 90, 180, "", "", true);
            squat.SetJoint(5, 90, 180, "", "", true);
            squat.SetJoint(6, 90, 180, "", "", true);
            _exercises.Add(Tuple.Create("Squat", squat));

            Exercise shoulderPress = new Exercise();
            shoulderPress.SetJoint(0, 130, 140, "Keep your left elbow straight!", "Keep your left elbow straight!", false);
            shoulderPress.SetJoint(1, -135, -70, "Get your left arm all the way down!", "Raise your left arm to 90 degrees sideways", true);
            shoulderPress.SetJoint(2, 0, 0, "", "", false);
            shoulderPress.SetJoint(3, 0, 0, "", "", false);
            shoulderPress.SetJoint(4, 0, 0, "", "", false);
            shoulderPress.SetJoint(5, 164, 102, "Get your right arm all the way down!", "Raise your right arm to 90 degrees sideways", true);
            shoulderPress.SetJoint(6, 125, 135, "Keep your right elbow straight!", "Keep your right elbow straight!", false);
            _exercises.Add(Tuple.Create("ShoulderPress", shoulderPress));

            Exercise leftLegBack = new Exercise();
            leftLegBack.SetJoint(0, 0, 0, "", "", false);
            leftLegBack.SetJoint(1, 0, 0, "", "", false);
            leftLegBack.SetJoint(2, 0, 0, "", "", false);
            leftLegBack.SetJoint(3, 74, 116, "Make sure your left leg goes all the way back!", "Push your leg back but not too far!", false);
            leftLegBack.SetJoint(4, 49, 49, "Keep your right leg steady!", "Keep your right leg steady!", true);
            leftLegBack.SetJoint(5, 0, 0, "", "", false);
            leftLegBack.SetJoint(6, 0, 0, "", "", false);
            _exercises.Add(Tuple.Create("LeftLegBack", leftLegBack));
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
                    currentExercise.joints[i].curr = _snap.BodyAngles[i];

                    if (currentExercise.joints[i].jointIsCheckedInExercise) {
                        if (currentExercise.joints[i].curr < currentExercise.joints[i].startAngle)
                            _snap.Remark = currentExercise.joints[i].errorMessage1;
                        else if (currentExercise.joints[i].curr > currentExercise.joints[i].endAngle)
                            _snap.Remark = currentExercise.joints[i].errorMessage2;
                    }
                }

                if (string.IsNullOrEmpty(_snap.Remark))
                {
                    _snap.Remark = "Good Job!";
                }

                await Task.Delay(2000);
            }
            
        }
    }
}