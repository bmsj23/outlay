import receiptIcon from '../assets/icons/receipt.svg'

export const AppHeader = () => (
  <header className="app-header">
    <div className="app-container header-content">
      <a className="brand" href="#main-content" aria-label="Outlay home">
        <span className="brand-mark" aria-hidden="true">
          <img src={receiptIcon} alt="" />
        </span>
        <span>Outlay</span>
      </a>
    </div>
  </header>
)