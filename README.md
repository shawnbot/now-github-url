# now-github-url
This is a Node module and command line utility for getting the correct URL of
the [Now] deployment automatically created by [Now's GitHub integration][Now for GitHub].
Given a git directory with a GitHub remote and a git "ref" (a commit SHA or
branch name), it uses the GitHub and Now REST APIs to:

1. Get the [commit status] created by Now for the given ref, the URL of which
   contains the deployment id; then
1. Get the deployment info from the Now API, which tells us the hostname for
   the given deployment id.

In other words:

```
repo + ref → GitHub API → commit status → deployment id → Now API → hostname
```

This tool makes it easy to alias Now deployments for each branch after tests
pass on your CI provider. For instance, in Travis:

1. Run `npm install --save --dev now-github-url`
1. Add a `script/deploy` script that does the following:

    ```bash
    branch="$TRAVIS_BRANCH"
    alias=$(now-github-url --ref="$TRAVIS_COMMIT")
    # or hard-code the prefix if you don't have a "name" field
    prefix=$(jq -r .name now.json)
    now $* alias "${prefix}-${branch}.now.sh"
    ```

    Or, if you need to test path aliases in your branch deployment:

    ```bash
    branch="$TRAVIS_BRANCH"
    root="$(now-github-url --ref="$TRAVIS_COMMIT")"
    now $* alias $root
    cat rules.json | jq -rM ".rules[-1].dest = \"$root\"" > rules-preview.json
    # or hard-code the prefix if you don't have a "name" field
    prefix=$(jq -r .name now.json)
    now $* alias "${prefix}-${branch}.now.sh" -r rules-preview.json
    ```

1. Add a `deploy` section to your `.travis.yml` that runs the script with your
   `NOW_TOKEN` environment variable:

    ```yaml
    deploy:
      on:
        branch: staging
      provider: script
      script: script/deploy
      skip_cleanup: true
    ```

1. Create a new Now access token from your dashboard and add it as an
   environment variable to your Travis repo settings as `NOW_TOKEN`.

1. If you don't have one already, create a GitHub API access token and add it
   to your environment as `GH_TOKEN`.

1. 💰

## Local usage
You can also use the utility in a local git repo if you're logged in with the
Now CLI and have `GH_TOKEN` set to a GitHub access token in your environment.

```sh
cd ~/my/cool/repo
export NOW_TOKEN="..."
export GH_TOKEN="..."
npx now-github-url
```

[Now]: https://zeit.co/now
[Now for GitHub]: https://zeit.co/github
[commit status]: https://developer.github.com/v3/repos/statuses/
