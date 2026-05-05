import type { AccessRequest } from '@/data/assessment'

type NextStepsProps = {
  requests: AccessRequest[]
}

export function NextSteps({ requests }: NextStepsProps) {
  return (
    <section className="next-steps section">
      <h2>Next Steps:</h2>
      <p>
        In order to complete our comprehensive Digital Health & Growth
        Assessment to identify opportunities for improvement across your
        ecosystem, CXO needs additional access. This is, of course, to identify
        opportunities for ecosystem health, maturity, competitive feature
        analysis & recommendations at your discretion.
      </p>
      <p>
        For 'XYZ organization', additional insight can be provided for our
        comprehensive assessment, given access or stakeholder consultation on:
      </p>

      <div className="access-table" role="table">
        <div className="access-row access-head" role="row">
          <span role="columnheader">Access Requested...</span>
          <span role="columnheader">...To Discover...</span>
          <span role="columnheader">...In Order To:</span>
        </div>
        {requests.map((request) => (
          <div className="access-row" role="row" key={request.access}>
            <strong role="cell">{request.access}</strong>
            <div role="cell">
              {request.discover.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div role="cell">
              {request.outcome.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
