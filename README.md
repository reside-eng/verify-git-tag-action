# verify-git-tag-action (Archived)

Github Action for verifying if a Git tag exists in the remote origin of the cloned repository. It takes the version from your defined package.json file, uses it against an editable tag format, and performs a search against the remote origin. If the tag exists, the action will fail. If the tag does not exist the action will succeed.

# Usage

<!-- start usage -->
<!-- Warning: Content between these comments is auto-generated. Do NOT manually edit. -->

```yaml
- uses: reside-eng/verify-git-tag-version@v1
  with:
    # The directory where to find the package.json file to retrieve the version which
    # is used in association with tag-format.
    #
    # Default: ./
    package-directory: ''

    # The Git tag format used to identify releases.
    #
    # Default: v$version
    tag-format: ''
```

<!-- end usage -->

# Local Development

## Testing

To run your tests in watch mode, open up one terminal and run:

```sh
yarn tsc --watch
```

And in a second terminal, start up your tests in watch mode:

```sh
yarn test --watch
```

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
