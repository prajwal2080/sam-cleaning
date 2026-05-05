import SamCleaningClient from "./SamCleaningClient";

export default function Home() {
  return (
    <>
      <header className="top-bar">
        <div className="container top-inner">
          <div className="social-links" aria-label="Social media links">
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" aria-label="Google">
              <i className="fa-brands fa-google"></i>
            </a>
            <a href="#" aria-label="Pinterest">
              <i className="fa-brands fa-pinterest-p"></i>
            </a>
            <a href="#" aria-label="Snapchat">
              <i className="fa-brands fa-snapchat"></i>
            </a>
          </div>
          <p className="hours">
            <i className="fa-regular fa-clock"></i> Mon - Sat: 8:00am - 8:00pm
          </p>
          <a className="quote-btn" href="#">
            Get A Quote
          </a>
        </div>
      </header>

      <header className="main-header">
        <div className="container nav-shell">
          <a className="logo" href="#" aria-label="Sam Cleaning Home">
            <img src="/logo.jpg" alt="Sam Cleaning logo" />
          </a>

          <button
            className="menu-toggle"
            aria-expanded="false"
            aria-label="Toggle navigation"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className="main-nav" aria-label="Primary navigation">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Blog</a>
            <a href="#">Pages</a>
            <a href="#">Contact</a>
          </nav>

          <div className="quick-contact">
            <i className="fa-solid fa-phone-volume"></i>
            <div>
              <p>Quick Contact :</p>
              <a href="tel:+9858844000">+ 985 8844 000</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" aria-label="Hero slider">
          <div
            className="slide active"
            style={{
              ["--bg" as any]:
                "url('https://images.pexels.com/photos/4107122/pexels-photo-4107122.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            }}
          >
            <div className="overlay-card">
              <p className="tagline">Sparkling Homes. Stress-Free Life.</p>
              <h1>Professional Cleaning Experts</h1>
              <p>
                We provide reliable home and office cleaning with trained staff,
                safe products, and flexible weekly or one-time service plans.
              </p>
              <a href="#" className="cta">
                Book Cleaning Now <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div
            className="slide"
            style={{
              ["--bg" as any]:
                "url('https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            }}
          >
            <div className="overlay-card">
              <p className="tagline">Trusted Team. Spotless Every Time.</p>
              <h2>Deep Cleaning and Routine Care</h2>
              <p>
                From kitchens and bathrooms to offices and common areas, we
                remove dust, stains, and germs for a fresh healthy space.
              </p>
              <a href="#" className="cta">
                Get Free Estimate <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <button className="slider-btn prev" aria-label="Previous slide" type="button">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="slider-btn next" aria-label="Next slide" type="button">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </section>

        <section className="about-showcase" aria-label="Cleaning service highlights">
          <div className="container about-grid">
            <div className="about-visual" aria-hidden="true">
              <span className="ring ring-large"></span>
              <span className="ring ring-small"></span>

              <i className="fa-solid fa-spray-can-sparkles deco-icon icon-top-left"></i>
              <i className="fa-solid fa-broom deco-icon icon-top-right"></i>
              <i className="fa-solid fa-sponge deco-icon icon-bottom-right"></i>
              <i className="fa-solid fa-pump-soap deco-icon icon-bottom-left"></i>

              <figure className="photo-card photo-one">
                <img
                  src="https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Cleaner wiping kitchen surface"
                />
              </figure>

              <figure className="photo-card photo-two">
                <img
                  src="https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Cleaner disinfecting a table"
                />
              </figure>
            </div>

            <div className="about-content">
              <h2>
                <span>Making Your House</span>
                As Good As New
              </h2>

              <p>
                Our professional cleaning team gives your home a fresh, healthy
                finish. From deep cleaning to regular weekly visits, we deliver
                dependable service, careful attention to detail, and spotless
                results every time.
              </p>

              <ul className="about-points">
                <li>
                  <i className="fa-solid fa-check"></i> Experienced Team
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Keep the same cleaner
                  for every visit
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> One-off, weekly or
                  fortnightly visits
                </li>
                <li>
                  <i className="fa-solid fa-check"></i> Book, manage and pay
                  online
                </li>
              </ul>

              <div className="about-actions">
                <a href="#" className="service-btn">
                  Book a Service <i className="fa-solid fa-arrow-right"></i>
                </a>
                <a href="tel:0407252583" className="about-phone">
                  <i className="fa-solid fa-phone-volume"></i> 0407252583
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="services-section" aria-label="Cleaning services">
          <div className="container services-inner">
            <div className="services-header">
              <p className="services-kicker">
                <i className="fa-regular fa-sparkles"></i>
              </p>
              <h2>Cleaning Services</h2>
              <p>
                We offer flexible cleaning packages for homes, workplaces, and
                rental properties. Every service is handled by trained
                professionals using safe products and a clear checklist.
              </p>
            </div>

            <div className="services-grid">
              <article className="service-card">
                <div className="service-image">
                  <img
                    src="https://images.pexels.com/photos/4108714/pexels-photo-4108714.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Residential and commercial cleaning team at work"
                  />
                </div>
                <div className="service-icon">
                  <i className="fa-solid fa-house"></i>
                </div>
                <div className="service-content">
                  <h3>Residential and Commercial Cleaning</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-check"></i> Homes and office
                      spaces
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Kitchen, bathrooms,
                      and floors
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Weekly, fortnightly,
                      or one-time
                    </li>
                  </ul>
                </div>
              </article>

              <article className="service-card">
                <div className="service-image">
                  <img
                    src="https://images.pexels.com/photos/5691628/pexels-photo-5691628.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Post-construction cleaning in a renovated interior"
                  />
                </div>
                <div className="service-icon">
                  <i className="fa-solid fa-helmet-safety"></i>
                </div>
                <div className="service-content">
                  <h3>Construction Cleaning</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-check"></i> Dust and debris
                      removal
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Detailed window and
                      surface clean
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Move-in ready
                      finishing touch
                    </li>
                  </ul>
                </div>
              </article>

              <article className="service-card">
                <div className="service-image">
                  <img
                    src="https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Airbnb cleaning and turnover preparation"
                  />
                </div>
                <div className="service-icon">
                  <i className="fa-solid fa-key"></i>
                </div>
                <div className="service-content">
                  <h3>Airbnb Cleaning</h3>
                  <ul>
                    <li>
                      <i className="fa-solid fa-check"></i> Fast guest turnover
                      cleaning
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Linen reset and
                      restocking
                    </li>
                    <li>
                      <i className="fa-solid fa-check"></i> Photo-ready finish
                      every stay
                    </li>
                  </ul>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="estimate-cta" aria-label="Free estimate call to action">
          <div className="container estimate-cta-inner">
            <div className="estimate-cta-copy">
              <h2>Get started with your free estimate</h2>
            </div>

            <a href="#" className="estimate-cta-btn">
              Get an Estimate <i className="fa-solid fa-arrow-right"></i>
            </a>

            <div className="estimate-cta-art" aria-hidden="true">
              <span className="bubble b1"></span>
              <span className="bubble b2"></span>
              <span className="bubble b3"></span>
              <span className="bubble b4"></span>
              <img
                src="https://images.pexels.com/photos/4108772/pexels-photo-4108772.png?auto=compress&cs=tinysrgb&w=900"
                alt=""
              />
            </div>
          </div>
        </section>

        <section className="request-estimate" aria-label="Request estimate section">
          <div className="container request-grid">
            <div className="request-copy">
              <h2>Our Goal is to Wow With Every Clean</h2>
              <p className="request-lead">
                We combine trained cleaners, quality tools, and reliable
                scheduling to deliver spotless spaces for homes and businesses.
              </p>
              <p>
                From weekly maintenance to deep one-time visits, our team
                follows a clear checklist and pays close attention to detail so
                every room feels fresh, healthy, and ready to enjoy.
              </p>

              <div className="request-points">
                <article>
                  <h3>
                    <i className="fa-regular fa-circle-check"></i> Customer
                    Focused Reviews
                  </h3>
                  <p>
                    Every visit is quality-checked so your feedback is always
                    heard and acted on.
                  </p>
                </article>

                <article>
                  <h3>
                    <i className="fa-regular fa-circle-check"></i> We Are
                    Committed
                  </h3>
                  <p>
                    Our team arrives on time, fully prepared, and dedicated to
                    consistent results.
                  </p>
                </article>

                <article>
                  <h3>
                    <i className="fa-regular fa-circle-check"></i> Regular and
                    Monthly Cleaning
                  </h3>
                  <p>
                    Choose one-time, weekly, fortnightly, or monthly plans that
                    fit your routine.
                  </p>
                </article>
              </div>
            </div>

            <aside className="estimate-form-card" aria-label="Request estimate form">
              <h3>Request An Estimate</h3>
              <form
                className="estimate-form"
                action="/api/bookings"
                method="post"
              >
                <select aria-label="Service type" name="serviceType" defaultValue="Residential">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Construction Cleaning</option>
                  <option>Airbnb Cleaning</option>
                </select>

                <input
                  type="text"
                  name="rooms"
                  placeholder="How many rooms?"
                  aria-label="How many rooms"
                />

                <div className="estimate-form-grid">
                  <select aria-label="Property type" name="propertyType" defaultValue="Property Type">
                    <option>Property Type</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Office</option>
                  </select>

                  <select aria-label="Approximate square feet" name="approxSf" defaultValue="Approx SF">
                    <option>Approx SF</option>
                    <option>Under 1000</option>
                    <option>1000 - 2000</option>
                    <option>2000+</option>
                  </select>

                  <select aria-label="Bedrooms" name="bedrooms" defaultValue="Bedrooms">
                    <option>Bedrooms</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3+</option>
                  </select>

                  <select aria-label="Bathrooms" name="bathrooms" defaultValue="Bathrooms">
                    <option>Bathrooms</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3+</option>
                  </select>

                  <select aria-label="Frequency" name="frequency" defaultValue="Frequency">
                    <option>Frequency</option>
                    <option>One-time</option>
                    <option>Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                  </select>

                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP Code"
                    aria-label="ZIP code"
                  />

                  <label className="field-icon">
                    <input
                      id="serviceDate"
                      className="js-service-date"
                      type="text"
                      name="serviceDate"
                      placeholder="dd/mm/yy"
                      aria-label="Service date"
                      autoComplete="off"
                      data-ics-url="https://calendar.google.com/calendar/ical/ef33cd75da97d7be2c22fe2f7d389cf158c9ad94436a6fc4a4ed59a375ff8a1e%40group.calendar.google.com/public/basic.ics"
                    />
                    <i className="fa-regular fa-calendar"></i>
                  </label>

                  <label className="field-icon">
                    <input
                      id="serviceTime"
                      className="js-service-time"
                      type="text"
                      name="serviceTime"
                      placeholder="Time"
                      aria-label="Service time"
                      autoComplete="off"
                      inputMode="numeric"
                    />
                    <i className="fa-regular fa-clock"></i>
                  </label>

                  <input type="text" name="fullName" placeholder="Name" aria-label="Full name" />
                  <input type="tel" name="phone" placeholder="Phone" aria-label="Phone" />
                </div>

                <input type="email" name="email" placeholder="E-mail Address" aria-label="E-mail address" />
                <textarea name="address" placeholder="Address" rows={3} aria-label="Address"></textarea>

                <button type="submit">
                  Book Now <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </aside>
          </div>
        </section>

        <section className="pricing-section" aria-label="Affordable pricing plans">
          <div className="container pricing-inner">
            <div className="pricing-header">
              <p className="pricing-kicker">
                <i className="fa-regular fa-sparkles"></i>
              </p>
              <h2>Affordable Pricing</h2>
              <p>
                Choose a plan that fits your space and schedule. Transparent
                pricing, no hidden fees, and reliable cleaning every visit.
              </p>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <div className="plan-icon">
                  <i className="fa-solid fa-spray-can-sparkles"></i>
                </div>
                <h3>Basic</h3>
                <ul>
                  <li>
                    <i className="fa-solid fa-check"></i> Surfaces hand wiped
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Floors cleaned
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> General dusting
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Cobwebs removed
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Doors cleaned
                  </li>
                </ul>
                <p className="plan-price">$49</p>
                <p className="plan-period">/per mo</p>
                <a href="#" className="plan-btn">
                  Get It Now
                </a>
              </article>

              <article className="pricing-card popular">
                <span className="card-ribbon">Popular Sale!</span>
                <div className="plan-icon">
                  <i className="fa-solid fa-broom"></i>
                </div>
                <h3>Standard</h3>
                <ul>
                  <li>
                    <i className="fa-solid fa-check"></i> Surfaces hand wiped
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Floors cleaned
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> General dusting
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Cobwebs removed
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Doors cleaned
                  </li>
                </ul>
                <p className="plan-price">$99</p>
                <p className="plan-period">/per mo</p>
                <a href="#" className="plan-btn">
                  Get It Now
                </a>
              </article>

              <article className="pricing-card">
                <div className="plan-icon">
                  <i className="fa-solid fa-squeegee"></i>
                </div>
                <h3>Premium</h3>
                <ul>
                  <li>
                    <i className="fa-solid fa-check"></i> Surfaces hand wiped
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Floors cleaned
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> General dusting
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Cobwebs removed
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Doors cleaned
                  </li>
                </ul>
                <p className="plan-price">$199</p>
                <p className="plan-period">/per mo</p>
                <a href="#" className="plan-btn">
                  Get It Now
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="specialists-section" aria-label="Specialists and completed projects">
          <div className="container specialists-inner">
            <div className="specialists-panel">
              <h2>All of our Specialists are Fully Trained</h2>

              <div className="specialists-stats">
                <article className="specialist-stat">
                  <i
                    className="fa-regular fa-thumbs-up specialist-watermark"
                    aria-hidden="true"
                  ></i>
                  <p className="counter-value" data-target="159" data-duration="1700">
                    0
                  </p>
                  <p className="counter-label">Project Done</p>
                </article>

                <article className="specialist-stat">
                  <i
                    className="fa-regular fa-circle specialist-watermark"
                    aria-hidden="true"
                  ></i>
                  <p className="counter-value" data-target="1900" data-duration="2000">
                    0
                  </p>
                  <p className="counter-label">Happy Clients</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section" aria-label="Client testimonials">
          <div className="container testimonials-inner">
            <div className="testimonials-header">
              <p className="testimonials-kicker">
                <i className="fa-regular fa-sparkles"></i>
              </p>
              <h2>What Our Clients Say</h2>
              <p>
                Real feedback from homeowners and businesses who trust our team
                for reliable, high-quality cleaning and friendly service.
              </p>
            </div>

            <div className="testimonials-grid">
              <article className="testimonial-card">
                <div className="testimonial-top">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Client portrait"
                  />
                  <div>
                    <h3>Sarah Mitchell</h3>
                    <p>Homeowner</p>
                  </div>
                </div>
                <div className="testimonial-stars" aria-label="5 star rating">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <blockquote>
                  The team is always on time and very detailed. My home feels
                  fresh and spotless after every visit.
                </blockquote>
              </article>

              <article className="testimonial-card featured">
                <div className="testimonial-top">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Client portrait"
                  />
                  <div>
                    <h3>Daniel Ross</h3>
                    <p>Office Manager</p>
                  </div>
                </div>
                <div className="testimonial-stars" aria-label="5 star rating">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <blockquote>
                  We booked regular commercial cleaning and the quality has been
                  excellent. Professional staff and great communication.
                </blockquote>
              </article>

              <article className="testimonial-card">
                <div className="testimonial-top">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Client portrait"
                  />
                  <div>
                    <h3>Emily Carter</h3>
                    <p>Airbnb Host</p>
                  </div>
                </div>
                <div className="testimonial-stars" aria-label="5 star rating">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <blockquote>
                  Fast turnover, neat presentation, and consistent results every
                  time. My guests notice the difference.
                </blockquote>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" aria-label="Website footer">
        <div className="container footer-inner">
          <div className="footer-links-grid">
            <div className="footer-col">
              <h3>Features</h3>
              <ul>
                <li>
                  <a href="#">Residential Services</a>
                </li>
                <li>
                  <a href="#">Commercial Services</a>
                </li>
                <li>
                  <a href="#">Vehicle Wash</a>
                </li>
                <li>
                  <a href="#">Laundry Facilities</a>
                </li>
                <li>
                  <a href="#">Carpet Removal</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Company</h3>
              <ul>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">Testimonials</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
                <li>
                  <a href="#">Media Kit</a>
                </li>
                <li>
                  <a href="#">Sitemap</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#">Features</a>
                </li>
                <li>
                  <a href="#">Pricing</a>
                </li>
                <li>
                  <a href="#">Partners</a>
                </li>
                <li>
                  <a href="#">Cloud Affiliate Program</a>
                </li>
              </ul>
            </div>

            <div className="footer-col footer-contact">
              <h3>Address</h3>
              <ul>
                <li>Riverstone, NSW, Australia, 2765</li>
                <li>
                  <a href="tel:0407252583">Phone: 0407252583</a>
                </li>
                <li>
                  <a href="mailto:prajwalwork651@gmail.com">
                    Email: prajwalwork651@gmail.com
                  </a>
                </li>
              </ul>
              <a
                href="mailto:prajwalwork651@gmail.com"
                className="footer-question-btn"
              >
                <i className="fa-regular fa-envelope"></i> HAVE ANY QUESTION
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <form
              className="footer-newsletter"
              action="#"
              method="post"
              aria-label="Newsletter form"
            >
              <label htmlFor="footer-search">
                Sign up for news and special offers
              </label>
              <div className="newsletter-row">
                <input
                  id="footer-search"
                  name="search"
                  type="text"
                  placeholder="Search Keywords ..."
                />
                <button type="submit">Submit</button>
              </div>
            </form>

            <div className="footer-social">
              <p>Follow Us On :</p>
              <div className="footer-social-links" aria-label="Footer social links">
                <a href="#" aria-label="Facebook">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#" aria-label="Google">
                  <i className="fa-brands fa-google-plus-g"></i>
                </a>
                <a href="#" aria-label="Pinterest">
                  <i className="fa-brands fa-pinterest-p"></i>
                </a>
                <a href="#" aria-label="Vimeo">
                  <i className="fa-brands fa-vimeo-v"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <SamCleaningClient />
    </>
  );
}
