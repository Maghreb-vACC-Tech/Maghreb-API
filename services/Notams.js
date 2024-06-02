function GetNotam(req,res){
  
    const Name = req.params.airport;

    // console.log(Name)
    const bearerToken = 
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjA0X3JsNjNvV2ZBSVc3WEd4UWUzQzVEY3dkTSIsImtpZCI6IjA0X3JsNjNvV2ZBSVc3WEd4UWUzQzVEY3dkTSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LmFwaS5uYXZpZ3JhcGguY29tIiwiYXVkIjoiaHR0cHM6Ly9pZGVudGl0eS5hcGkubmF2aWdyYXBoLmNvbS9yZXNvdXJjZXMiLCJleHAiOjE3MTMwMjAxMzAsIm5iZiI6MTcxMzAxNjUzMCwiY2xpZW50X2lkIjoic2ltYnJpZWYiLCJzY29wZSI6WyJvcGVuaWQiLCJvZmZsaW5lX2FjY2VzcyIsImZtc2RhdGEiLCJzaW1icmllZiJdLCJzdWIiOiJhNDQ4ZmJjNy05YTZmLTRmZmYtYWFkMS0xYjdkMmM4MzNmNjEiLCJhdXRoX3RpbWUiOjE3MTI3Mjc0NDIsImlkcCI6Im5hdmlncmFwaCIsImFtciI6WyJwYXNzd29yZCJdLCJzdWJzY3JpcHRpb25zIjpbXX0.sHhutqAsKvt4mRNtiJF0_2KeJ44BsDmF4jj6Eg3KPwWcnDcDx4a-BMJnCaUYpOcsbuollXb5WtHL1JDFgKc_xb3_JOecArk24gDmNeid_jaBhatbCBaCqh5HfOxM8n9gDvLCbQoCR86-6maJIpwVoxN09BYi45_X_uyYpbXA9x1Nje21-KwGT5HVgygxP9Rpr_6d7lyn3KU5npdPGngzbGFjw5br4Kggjt_L5NDtyK5iZJXIn9YyVGKNe9YvwptLDbLCG2FAXUAe5d2f1_UXIhVw983RDwO7epvDRuhbFSj9_kLYs3KY2ByFgoDg-VN30MWfJTSyE08zSRepVo31XQ';
    const prefix = 'Bearer'; 
    fetch(`https://api.simbrief.com/v2/notams?icaos=${Name}`, {
        headers: {
        Authorization: ``
        }
    })
    .then(data => data.json())
    .then(data => res.send(data))
    .catch((err)=>{
        console.log(`Handled Error : ${err}`)
        res.send("Error Check API Logs")
    })

}

module.exports = {
    GetNotam
    };
    