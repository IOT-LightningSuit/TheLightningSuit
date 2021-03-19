using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LightningSuitServer.Entities
{
    public class Document
    {
        public string UserName { get; set; }
        public List<int> Results { get; set; }

        public Document(string un)
        {
            UserName = un;
            Results = new List<int>();
        }
    }
}
