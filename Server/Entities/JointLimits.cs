namespace LightningSuitServer.Entities
{
    public class JointLimits
    {
        public float startAngleX;
        public float endAngleX;
        public string errorMessage;
        public float curr;
        public float prev;

        public JointLimits(float sax, float eax, string err)
        {
            startAngleX = sax;
            endAngleX = eax;
            errorMessage = err;
        }
    }
}
