/**
 * Contains everything that belongs into the html footer
 * License, Credits
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */
export default function Footer() {
    return (
        <div id="footer">
            <div id="licence" className="clearfix">
                Credits to <a href="//github.com/littleark">Carlo Zapponi</a>
                <br />
                This work is licensed under the{" "}
                <a // eslint-disable-line react/jsx-no-target-blank
                    rel="noopener"
                    href="//www.gnu.org/licenses/agpl-3.0.en.html"
                    target="_blank"
                >
                    GNU Affero General Public License
                </a>
            </div>
        </div>
    )
}
