/**
 * Contains everything that belongs into the html head
 * Title, css, fonts
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

import Helmet from "react-helmet"

export default function Application() {
    return (
        <div className="application">
            <Helmet
                title="Github Language Stats"
                meta={[{ charset: "utf-8" }]}
            />
        </div>
    )
}
