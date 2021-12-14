require("./common");

require.ensure([], () => {
  require("./async");
});

document.body.innerHTML = `${document.body.innerHTML}<p>index.js</p>`;
