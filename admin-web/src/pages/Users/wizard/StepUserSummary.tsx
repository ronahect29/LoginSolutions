export function StepUserSummary({ user, apps, roles }: any) {
    return (
        <div className="uw-step">
            <h3>Resumen</h3>
            <pre className="uw-summary">
                {JSON.stringify({ user, apps, roles }, null, 2)}
            </pre>
        </div>
    );
}