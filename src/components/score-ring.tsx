type ScoreRingProps = {
  score: number
  maxScore: number
  color: string
  label: string
}

export function ScoreRing({ score, maxScore, color, label }: ScoreRingProps) {
  const percent = Math.round((score / maxScore) * 100)

  return (
    <div className="score-ring-group">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(${color} ${percent}%, #d5ddec 0)`,
        }}
      >
        <div className="score-ring-inner">
          <strong>{score}</strong>
          <span>/ {maxScore}</span>
        </div>
      </div>
      <span className="score-ring-label">{label}</span>
    </div>
  )
}
