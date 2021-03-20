namespace LightningSuitServer.Entities
{
    public class JointLimits
    {
        public bool jointIsCheckedInExercise;
        public float startAngle;
        public float endAngle;
        public string errorMessage1;
        public string errorMessage2;
        public float curr;
        public float prev;
        public float min;
        public float max;

        public JointLimits(float sax, float eax, string err1, string err2, bool check)
        {
            if (startAngle > endAngle)
                System.Console.WriteLine("Make sure to define start angle less than end angle!");

            jointIsCheckedInExercise = check;
            startAngle = sax;
            endAngle = eax;
            errorMessage1 = err1;
            errorMessage2 = err2;
            curr = sax;
            prev = sax;
            min = sax;
            max = eax;
        }
    }
}
