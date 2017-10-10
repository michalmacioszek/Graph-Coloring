using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using API.Models;


namespace API.GraphColoring
{
    // A C# program to implement greedy algorithm for graph coloring

    // This class represents an undirected graph using adjacency list
    public class ColoringAlgorithm
    {
        public int V; // No. of vertices
        public List<List<int>> adj;
        //Constructor
        public ColoringAlgorithm(int v)
        {
            V = v;
            adj = new List<List<int>>();
            for (int i = 0; i < v; ++i)
            {
                adj.Add(new List<int>());
            }
        }

        //Function to add an edge into the graph
        public void addEdge(int v, int w)
        {
            adj[v].Add(w);
            adj[w].Add(v); //Graph is undirected
        }

        // Assigns colors (starting from 0) to all vertices and
        // prints the assignment of colors
        public string greedyColoring()
        {
            int[] result = new int[V];

            // Assign the first color to first vertex
            result[0] = 0;

            // Initialize remaining V-1 vertices as unassigned
            for (int u = 1; u < V; u++)
            {
                result[u] = -1; // no color is assigned to u
            }

            // A temporary array to store the available colors. True
            // value of available[cr] would mean that the color cr is
            // assigned to one of its adjacent vertices
            bool[] available = StoreColors();

            // Assign colors to remaining V-1 vertices
            AsignColors(result, available);
            List<ResponseModel> responseList = new List<ResponseModel>();
            // print the result
            for (int u = 0; u < V; u++)
            {
                responseList.Add(new ResponseModel(u, result[u]));
            }
            var json = new JavaScriptSerializer().Serialize(responseList);
            return json;
        }

        private void AsignColors(int[] result, bool[] available)
        {
            for (int u = 1; u < V; u++)
            {
                // Process all adjacent vertices and flag their colors
                // as unavailable
                IEnumerator<int> it = adj[u].GetEnumerator();
                while (it.MoveNext())
                {
                    int i = it.Current;
                    if (result[i] != -1)
                    {
                        available[result[i]] = true;
                    }
                }

                // Find the first available color
                int cr;
                for (cr = 0; cr < V; cr++)
                {
                    if (available[cr] == false)
                    {
                        break;
                    }
                }

                result[u] = cr; // Assign the found color

                // Reset the values back to false for the next iteration
                it = adj[u].GetEnumerator();
                while (it.MoveNext())
                {
                    int i = it.Current;
                    if (result[i] != -1)
                    {
                        available[result[i]] = false;
                    }
                }
            }
        }

        private bool[] StoreColors()
        {
            bool[] available = new bool[V];
            for (int cr = 0; cr < V; cr++)
            {
                available[cr] = false;
            }

            return available;
        }

    }
}