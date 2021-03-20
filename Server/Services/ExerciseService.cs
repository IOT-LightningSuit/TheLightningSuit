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
            //squat.SetJoint(1, 90, 180, "Raise your right arm!", true);
            //squat.SetJoint(2, 90, 180, "Raise tour left arm!", true);
            //squat.SetJoint(3, 90, 180, "", true);
            //squat.SetJoint(4, 90, 180, "", true);
            //squat.SetJoint(5, 90, 180, "", true);
            //squat.SetJoint(6, 90, 180, "", true);
            _exercises.Add(Tuple.Create("Squat", squat));

            Exercise shoulderPress = new Exercise();
            //shoulderPress.SetJoint(0, 0, 0, "Keep your elbow straight!", true);
            //shoulderPress.SetJoint(1, 180, 0, "Raise your left arm!", true);
            //shoulderPress.SetJoint(2, 0, 0, "Keep your elbow straight!", true);
            //shoulderPress.SetJoint(3, -180, 0, "Raise your left arm!", true);
            //shoulderPress.SetJoint(4, 0, 0, "Keep your legs straight!", true);
            //shoulderPress.SetJoint(5, 0, 0, "Keep your legs straight!", true);
            //shoulderPress.SetJoint(6, 0, 0, "Keep your legs straight!", true);
            _exercises.Add(Tuple.Create("ShoulderPress", shoulderPress));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            const float angleTolerance = 5.0f;

            while (!stoppingToken.IsCancellationRequested)
            {   
                currentExercise = _exercises.Find(x => x.Item1 == _curr.CurrentEx)?.Item2;
                // Reset the remark to see if there are any errors during the exercise
                _snap.Remark = string.Empty;
                for (int i = 0; i < currentExercise.joints.Length; i++)
                {
                    currentExercise.joints[i].curr = _snap.BodyAngles[i];
                    // set movement direction according to prev angle - heading true means heading is from start to end
                    if (currentExercise.joints[i].jointIsCheckedInExercise) {
                        bool heading = currentExercise.joints[i].curr - currentExercise.joints[i].prev > 0.0f;
                        // update min/max movement
                        if (!heading && currentExercise.joints[i].curr < currentExercise.joints[i].min)
                            currentExercise.joints[i].min = currentExercise.joints[i].curr;
                        else if (heading && currentExercise.joints[i].curr > currentExercise.joints[i].max)
                            currentExercise.joints[i].max = currentExercise.joints[i].curr;

                        // reached the trainer's minimal movement
                        if (currentExercise.joints[i].min == currentExercise.joints[i].prev) {
                            // movement hasn't reached all the way through
                            if (heading && currentExercise.joints[i].min > currentExercise.joints[i].startAngleX + angleTolerance)
                                _snap.Remark = currentExercise.joints[i].errorMessage1;
                            // movement is too wide
                            else if (heading && currentExercise.joints[i].min < currentExercise.joints[i].startAngleX - angleTolerance)
                                _snap.Remark = currentExercise.joints[i].errorMessage2;
                        }
                        // reached the trainer's maximal movement
                        else if (currentExercise.joints[i].max == currentExercise.joints[i].prev)
                        {
                            // movement hasn't reached all the way through
                            if (!heading && currentExercise.joints[i].max < currentExercise.joints[i].endAngleX - angleTolerance)
                                _snap.Remark = currentExercise.joints[i].errorMessage1;
                            else if (!heading && currentExercise.joints[i].max > currentExercise.joints[i].endAngleX + angleTolerance)
                                _snap.Remark = currentExercise.joints[i].errorMessage2;
                        }

                    currentExercise.joints[i].prev = currentExercise.joints[i].curr;
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