// version: 7.12.0.a.1.6.9
// sha: 835c566e1ec050ad71cd3aa098a0e485f9f46113
function SetBookmark(){var o=window.parent,t=window.location.href;o.SetBookmark(t.substring(t.toLowerCase().lastIndexOf("/scormcontent/")+14,t.length),document.title),o.CommitData()}SetBookmark();