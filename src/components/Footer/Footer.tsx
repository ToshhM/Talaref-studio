'use client';

import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/Toshh_M', icon: 'X' },
    { name: 'Instagram', href: 'https://instagram.com/toshh_m', icon: 'IG' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/toshiro-mpika', icon: 'IN' },
];

const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Expertises', href: '#expertise' },
    { label: 'Projets', href: '#projets' },
    { label: 'Contact', href: '#contact' },
];

export default function Footer() {
    return (
        <footer className={styles.footer} id="contact">
            <div className={styles.container}>
                {/* Main Content */}
                <div className={styles.main}>
                    {/* Brand Column */}
                    <div className={styles.brand}>
                        <motion.a
                            href="#hero"
                            className={styles.logo}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className={styles.logoIcon}>
                                <img
                                    src="/images/logo-flame.png"
                                    alt="TALAREF Logo"
                                    className={styles.logoImage}
                                />
                            </div>
                            <span className={styles.logoText}>TALAREF</span>
                        </motion.a>
                        <p className={styles.tagline}>
                            La forge de vos idées,<br />
                            le feu de votre succès.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className={styles.navColumn}>
                        <h4 className={styles.columnTitle}>Navigation</h4>
                        <ul className={styles.navList}>
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <a href={link.href} className={styles.navLink}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.contactColumn}>
                        <h4 className={styles.columnTitle}>Contact</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <a href="mailto:contact@toshh.fr" className={styles.contactLink}>
                                    contact@toshh.fr
                                </a>
                            </li>
                            <li>
                                <a href="tel:+33635217526" className={styles.contactLink}>
                                    +33 6 35 21 75 26
                                </a>
                            </li>
                            <li className={styles.location}>
                                📍 Paris, France
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div className={styles.socialColumn}>
                        <h4 className={styles.columnTitle}>Suivez-nous</h4>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} TALAREF STUDIO. Tous droits réservés.
                    </p>
                    <p className={styles.credit}>
                        Conçu avec 🔥 par <span className={styles.creditName}>Toshiro MPIKA</span>
                    </p>
                </div>
            </div>

            {/* Background Glow */}
            <div className={styles.bgGlow} />
        </footer>
    );
}
