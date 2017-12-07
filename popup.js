chrome.storage.sync.get(null, function(items){
  console.log("Data retreived from storage");
  console.log(items);
});
window.addEventListener('load', function(){
  console.log("Loaded")
  var settingsSave = document.getElementById('save');
  var checkboxes = document.getElementsByClassName('check');
  console.log(settingsSave);
  console.log(checkboxes);
  settingsSave.addEventListener('click', function(){
    var data = {};
    for(var i = 0; i < checkboxes.length; i++){
      var checkbox = checkboxes[i];
      data[checkbox.name] = checkbox.checked;
    }
    console.log(data)
    chrome.storage.sync.set(data, function(){
      console.log("Data saved.")
    });
  });
});
