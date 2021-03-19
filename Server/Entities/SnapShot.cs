namespace LightningSuitServer.Entities
{
    public class SnapShot
    {
        //public float LLegX { get; set; }
        //public float LLegY { get; set; }
        //public float LLegZ { get; set; }
        //public float RLegX { get; set; }
        //public float RLegY { get; set; }
        //public float RLegZ { get; set; }
        //public float LArmX { get; set; }
        //public float LArmY { get; set; }
        //public float LArmZ { get; set; }
        //public float RArmX { get; set; }
        //public float RArmY { get; set; }
        //public float RArmZ { get; set; }
        //public float BackX { get; set; }
        //public float BackY { get; set; }
        //public float BackZ { get; set; }
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
