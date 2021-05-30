/**
 * Keeps language renamings that can happen
 * when the github api decides to change the language name,
 * to keep consistency we always choose the latest name and
 * replace all older names
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

export default {
    vim: {
        before: ["VimL"],
        after: "Vim script",
    },
    fortran: {
        before: ["FORTRAN"],
        after: "Fortran",
    },
}
