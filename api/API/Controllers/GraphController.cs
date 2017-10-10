using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using API.GraphColoring;
using API.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace API.Controllers
{
    public class GraphController : ApiController
    {
        public HttpResponseMessage Options()
        {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }
        // GET: api/Graph
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Graph/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Graph
        public string Post(HttpRequestMessage value)
        {
            string message = value.Content.ReadAsStringAsync().Result;
            string response = "";
            dynamic json = JsonConvert.DeserializeObject(message);
            var data = JsonConvert.DeserializeObject<List<GraphModel>>(json);
            if (!String.IsNullOrEmpty(data[0].graphSize))
            {
                ColoringAlgorithm g1 = new ColoringAlgorithm(Int32.Parse(data[0].graphSize));
                foreach (var v in data)
                {
                    g1.addEdge(Int32.Parse(v.key), Int32.Parse(v.value));
                }
                response = g1.greedyColoring();
            }

            return response;
        }

        // PUT: api/Graph/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Graph/5
        public void Delete(int id)
        {
        }
    }
}
