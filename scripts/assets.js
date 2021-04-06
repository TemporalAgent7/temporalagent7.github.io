// TODO: from shared.assets locally
let build_settings = {
    "BuildNumber": 7484,
    "SvnRevision": 145203,
    "BuildEnv": "stable1",
    "BuildType": "release",
    "AssetBundlesUrlOverride": ""
};

let platform = "OSX";

const now = new Date();
const utcMilllisecondsSinceEpoch = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
const timestamp = Math.round(utcMilllisecondsSinceEpoch / 1000);

let endpointUrl = `http://cdn0.client-files.proj-red.emeraldcitygames.ca/endpoints/${build_settings.BuildEnv}/v${build_settings.BuildNumber}/${build_settings.BuildEnv}-${platform}-release-endpoint.json?ts=${timestamp}`;

let data = {}; // TODO: await fetch(endpointUrl);
let assetBundleLocation = data.assetBundleLocation;
let gameServer = data.gameServer;

let assetsBaseUrl = `${assetBundleLocation}/${platform}/${platform}Red/`;

let bindataUrl = assetsBaseUrl + 'bindata';

// TODO:

// Download bindataUrl
// AssetBundle parse the downloaded data into separate .bytes files
// Deserialize the .bytes files with native C# app or translate scripts:
//      - https://referencesource.microsoft.com/#mscorlib/system/runtime/serialization/formatters/binary/binaryformatterwriter.cs
//      - https://github.com/agix/NetBinaryFormatterParser
//      - https://github.com/gurnec/Undo_FFG/blob/master/nrbf.py
// Save as Json
