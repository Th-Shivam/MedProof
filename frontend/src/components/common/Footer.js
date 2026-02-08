import React from 'react';
import '../../assets/css/Theme.css';
import { LanguageContext } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = React.useContext(LanguageContext);
    return (
        <footer className="gov-footer" style={{ padding: '2rem 0', background: '#1a1a1a', borderTop: '4px solid var(--gov-orange)', color: 'white', marginTop: 'auto' }}>
            <div className="gov-container" style={{ textAlign: 'center' }}>
                <div className="footer-bottom">
                    <p style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{t('footerRights')} <strong>{t('teamRooted')}</strong>.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>{t('hackathonSub')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
