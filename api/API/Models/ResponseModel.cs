using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class ResponseModel
    {
        public int vertex { get; set; }
        public int color { get; set; }

        public ResponseModel(int _vertex,int _color)
        {
            vertex = _vertex;
            color = _color;
        }
    }
}