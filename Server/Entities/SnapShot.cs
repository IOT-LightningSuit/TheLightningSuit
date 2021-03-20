namespace LightningSuitServer.Entities
{
    public class SnapShot
    {
        public float[] BodyAngles { get; set; }
        public string Remark { get; set; }

        public SnapShot()
        {
            BodyAngles = new float[7];
        }

        public void Change(int sensor, float xValue/*, float yValue, float zValue*/)
        {
            BodyAngles[sensor] = xValue;
            //bodyAngles[sensor, 1] = yValue;
            //bodyAngles[sensor, 2] = zValue;
        }
    }
}
