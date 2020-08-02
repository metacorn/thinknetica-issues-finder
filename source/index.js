import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import * as Toastr from "toastr";
import "../node_modules/toastr/build/toastr.css";
import moment from "moment";

const issuesFinderForm = document.querySelector("#issues-finder-form");
const issuesListContainer = document.querySelector("#issues-list-container");
issuesFinderForm.addEventListener("submit", issuesFinderFormSubmitHandler);

function issuesFinderFormSubmitHandler(event) {
    event.preventDefault();
    issuesListContainer.innerHTML = '';
    const submitButton = event.submitter;
    disableButton(submitButton);
    const username = event.target.elements["username"].value;
    const repository = event.target.elements["repository"].value;
    if (!username) { renderInfo(`You should enter a username!`) }
    if (!repository) { renderInfo(`You should enter a repository!`) }

    if (username && repository) {
        fetchIssues(username, repository)
            .then((result) => renderResult(result))
            .catch((error) => renderError(error));
    }

    enableButton(submitButton);
}

function disableButton(submitButton) {
    submitButton.setAttribute("disabled", "");
}

function enableButton(submitButton) {
    submitButton.removeAttribute("disabled");
}

async function fetchIssues(username, repository) {
    const response = await fetch(`https://api.github.com/repos/${username}/${repository}/issues`);
    if (!response.ok) { throw new Error(response.statusText) }
    const result = await response.json();

    let issuesList = result.map(({ number, title, body, created_at, html_url, user }) => ({
        number, title, body, created_at, html_url, username: user.login
    }));

    issuesList = issuesList.sort((a, b) => a.number - b.number);
    return issuesList;
}

function renderResult(issuesList) {
    if (issuesList.length > 0) {
        issuesListContainer.innerHTML = '<div class="list-group"></div>';
        issuesList.forEach((issue) => issuesListContainer.firstElementChild.append(issueTemplate(issue)));
    } else {
        issuesListContainer.innerHTML = '<p><h4>No issues found!</h4><p>';
    }
}

function issueTemplate(issue) {
    let template = document.createElement('a');
    template.setAttribute("target", "_blank");
    template.setAttribute("href", issue.html_url);
    template.setAttribute("class", "list-group-item list-group-item-action");
    template.innerHTML = `<strong>#${issue.number} ${issue.title}</strong> `
    template.innerHTML += `<small>(created by ${issue.username} at ${moment(issue.created_at).format('DD.MM.YYYY, H:mm')})</small>`;
    template.innerHTML += `<p class="mb-0"><small>${issue.body}</small></p>`;
    return template;
}

function renderError(error) {
    Toastr.error(`Oops! Something was wrong: ${error.message}.`);
}

function renderInfo(message) {
    Toastr.info(message);
}
