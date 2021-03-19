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

        public void SetJoint(int index, float sax,/* float say, float saz, */ float eax, /*float eay, float eaz,*/ string err)
        {
            joints[index] = new JointLimits(sax, eax, err);
        }
    }
}
