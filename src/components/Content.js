/**
 * The description / explanation of the chart and table, explains
 * data source, data aggregation, trend calculation, ...
 * Compiles markdown into html, content.md -> html
 * @author Fabian Beuke <mail@beuke.org>
 * @license AGPL-3.0
 */

export default function Content() {
    return (
        <div
            style={{
                margin: "auto",
                marginTop: "40px",
                marginBottom: "40px",
                maxWidth: 760,
                textAlign: "justify",
                fontSize: 13,
            }}
        >
            <h4 id="githut-2-0">GITHUT 2.0</h4>
            <p className="responsivity-mobile-modif">
                GitHut 2.0 is an attempt to continue the{" "}
                <a href="http://githut.info">githut.info</a> project. GitHub is
                the largest code host in the world, with 40 million users and
                more than 190 million repositories as of January 2020. By
                analyzing how languages are used in GitHub it&#39;s possible to
                understand the popularity of programming languages among
                developers and to discover the unique characteristics of each
                language. GitHub provides a public{" "}
                <a href="//developer.github.com/v3/">API</a> to interact with
                its huge dataset of events and interaction with the hosted
                repositories. The{" "}
                <a href="//githubarchive.org/">GitHub Archive</a> project goes
                one step further by aggregating and storing the API data over
                time. The quantitative data used in GitHut 2.0 is collected from
                the GitHub Archive dataset via{" "}
                <a href="//developers.google.com/bigquery/">Google BigQuery</a>.
            </p>
            <p className="responsivity-mobile-modif">
                The language percentage distribution in the line chart shows the
                top 10 (or manually selected) languages since 2012/Q2. The
                ranking table shows the top 50 languages of the last quarter.
                The percentage values are the actual fractions of pull requests,
                pushes, stars or issues in relation to the top 50 languages in
                the table. The YoY change shows the difference in percentage
                compared to the same time period last year. The YoY trend arrows
                indicate the change in ranking. Two arrows up/down stands for
                more than three ranks up/down within one year. No arrow
                indicates that nothing has changed and one arrow fills the gap.
                Please note that it is possible that the ranking shown in the
                table does not match the chart ranking, since they are
                calculated over a different time period (quarter vs. full
                history). Please also note that there is not enough data
                available in the GitHub Archive dataset to calculate a
                statistical accurate ranking table or chart for any time period
                before 2012/Q2.
            </p>
            <h4 id="related-work">Related Work</h4>
            <ul>
                <li className="responsivity-mobile-modif">
                    <a href="//tiobe.com/tiobe-index/">
                        TIOBE Programming Community Index
                    </a>{" "}
                    is a measure of popularity of programming languages, created
                    and maintained by the TIOBE Company based in Eindhoven, the
                    Netherlands.
                </li>
                <li className="responsivity-mobile-modif">
                    <a href="//redmonk.com/sogrady/2016/07/20/language-rankings-6-16/">
                        The RedMonk Programming Language Rankings
                    </a>{" "}
                    are derived from a correlation of programming traction on
                    GitHub and Stack Overflow.
                </li>
                <li className="responsivity-mobile-modif">
                    <a href="//pypl.github.io/PYPL.html">
                        The PYPL PopularitY of Programming Language Index
                    </a>{" "}
                    is created by analyzing how often language tutorials are
                    searched on Google.
                </li>
            </ul>
        </div>
    )
}
