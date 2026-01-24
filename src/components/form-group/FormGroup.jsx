export default function FormGroup({ children }) {
    const styles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        minWidth: '0px'
    }
    return <div style={styles}>{ children }</div>
}