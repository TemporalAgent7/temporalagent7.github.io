using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

using Newtonsoft.Json.Converters;
using Newtonsoft.Json;

using System.Reflection;

public class DeserializeData
{
    private string _basePath;
    private string _outPath;

    public DeserializeData(string basePath, string outPath)
    {
        _basePath = basePath;
        _outPath = outPath;
    }

    private string toJson(object obj)
    {
        JsonSerializerSettings settings = new JsonSerializerSettings();
        settings.Formatting = Formatting.Indented;
        settings.NullValueHandling = NullValueHandling.Ignore;
        settings.MissingMemberHandling = MissingMemberHandling.Ignore;
        settings.Converters = new JsonConverter[] { new StringEnumConverter() };
        settings.Error = (sender, args) =>
        {
            args.ErrorContext.Handled = true;
        };

        return JsonConvert.SerializeObject(obj, settings);
    }

    private void convertBytesToJson(string name)
    {
        BinaryFormatter formatter = new BinaryFormatter();
        using (FileStream fs = File.Open(_basePath + name + ".bytes", FileMode.Open))
        {
            object obj = formatter.Deserialize(fs);

            using (FileStream fsJson = File.Create(_outPath + name + ".json"))
            {
                byte[] info = new System.Text.UTF8Encoding(true).GetBytes(toJson(obj));
                fsJson.Write(info, 0, info.Length);
            }
        }
    }

    public void Start()
    {
        convertBytesToJson("GSCharacter");
        convertBytesToJson("GSBaseStat");
        convertBytesToJson("GSGear");
        convertBytesToJson("GSGearLevel");
        convertBytesToJson("GSItem");
        convertBytesToJson("GSLevel");
        convertBytesToJson("GSMorale");
        convertBytesToJson("GSProperties");
        convertBytesToJson("GSPvPLeagues");
        convertBytesToJson("GSRank");
        convertBytesToJson("GSRarity");
        convertBytesToJson("GSSkill");
        convertBytesToJson("GSSkillUpgrade");
        convertBytesToJson("GSAccessoryItems");
        convertBytesToJson("GSAccessoryStatGeneration");
        convertBytesToJson("GSAccessoryStatGrowth");
        convertBytesToJson("GSAccessoryUpgrading");
    }
}