'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root', 'repoName', 'contributors');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        const select = createAndAppend('select', root);
        createAndAppend('option', select, { text: 'choose a Repository' });
        data.forEach(repo => {
          const name = repo.name;
          createAndAppend('option', select, { text: name });
        });

        const repoInfo = createAndAppend('div', repoName);
        const contribs = createAndAppend('div', contributors);
        select.addEventListener('change', evt => {
          const selectedRepo = evt.target.value;
          const repo = data.filter(r => r.name == selectedRepo)[0];
          console.log(repo);
          repoInfo.innerHTML = '';
          contribs.innerHTML = '';

          const addInfo = (label, value) => {
            const container = createAndAppend('div', repoInfo);
            createAndAppend('span', container, { text: label });
            createAndAppend('span', container, { text: value });
          };
          addInfo('Name: ', repo.name);
          addInfo('Desciption: ', repo.description);
          addInfo('Updated: ', repo.updated_at);
          addInfo('forks:', repo.forks_url);

          const contribsUrl = repo.contributors_url;
          fetchJSON(contribsUrl, (err, contribData) => {
            contribData.forEach(contributor => {
              createAndAppend('div', contribs, { text: contributor.login });
              createAndAppend('img', contribs, { src: contributor.avatar_url });
            });
          });
        });
      }
    });
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
