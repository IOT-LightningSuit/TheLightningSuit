using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using LightningSuitServer.Entities;

namespace LightningSuitServer.Repository
{
    public class MongoWriter
    {
        private readonly IMongoDatabase _db;
        public MongoWriter()
        {
            var client = new MongoClient("mongodb://127.0.0.1:27017");
            _db = client.GetDatabase("LightningSuit");
        }

        public bool AddUser(string userName)
        {
            var collection = _db.GetCollection<BsonDocument>("UserResults");
            var filter = Builders<BsonDocument>.Filter.Eq("UserName", userName);
            if(collection.Find(filter).FirstOrDefault() == null)
            {
                var doc = new Document(userName);
                doc.Results = new List<int>();
                
                collection.InsertOne(doc.ToBsonDocument());
                return true;
            }
            return false;
        }

        public void AddResult(string userName, int result)
        {
            var collection = _db.GetCollection<BsonDocument>("UserResults");
            var filter = Builders<BsonDocument>.Filter.Eq("UserName", userName);
            var doc = collection.Find(filter).FirstOrDefault();

            List<int> newResults = new List<int>();
            foreach(var res in doc.GetElement("Results").Value.AsBsonArray)
            {
                newResults.Add(res.AsInt32);
            }
            newResults.Add(result);

            var doc2 = new Document(userName);
            doc2.Results = newResults;

            collection.DeleteOne(filter);
            collection.InsertOne(doc2.ToBsonDocument());
        }

        public List<int> GetResults(string userName)
        {
            var collection = _db.GetCollection<BsonDocument>("UserResults");
            var filter = Builders<BsonDocument>.Filter.Eq("UserName", userName);
            var doc = collection.Find(filter).FirstOrDefault();

            List<int> newResults = new List<int>();
            foreach (var res in doc.GetElement("Results").Value.AsBsonArray)
            {
                newResults.Add(res.AsInt32);
            }

            return newResults;
        }
    }
}
