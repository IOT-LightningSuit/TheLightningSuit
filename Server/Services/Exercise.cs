using LightningSuitServer.Entities;

namespace LightningSuitServer.Services
{
    public class Exercise
    {
        public readonly JointLimits[] joints;
        public Exercise()
        {
            joints = new JointLimits[7];
        }

        public void SetJoint(int index, float sax,float eax, string err1, string err2, bool check)
        {
            joints[index] = new JointLimits(sax, eax, err1, err2, check);
        }
    }
}
