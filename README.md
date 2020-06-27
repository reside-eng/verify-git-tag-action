# verify-git-tag-action

Github Action for verifying if a Git tag exists in the remote origin of the cloned repository. It takes the version from your defined package.json file, uses it against an editable tag format, and performs a search against the remote origin. If the tag exists, the action will fail. If the tag does not exist the action will succeed.

# Usage

<!-- start usage -->
<!-- Warning: Content between these comments is auto-generated. Do NOT manually edit. -->
```yaml
- uses: reside-eng/verify-git-tag-version@v1
  with:
    # The directory where to find the package.json file to retrieve the version
    # whichis used in association with tag-format.
    #
    # [Learn more about creating and using secrets](https://help.github.com/en/actions)
    #
    # Default: ./
    package-directory: ''

    # The Git tag format used to identify releases.
    #
    # Default: v$version
    tag-format: ''
```
<!-- end usage -->

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
