'use client';

import { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  image: string | null;
  url: string;
}

const initialArticleUrls = [
  'https://www.bu.edu/articles/2024/a-robot-on-a-mission/',
  'https://www.bu.edu/eng/2020/07/08/when-the-robot-becomes-the-researcher/',
  'https://www.bu.edu/photonics/2023/02/24/how-keith-browns-lab-is-hastening-materials-research-using-machine-learning-and-autonomous-research-robots/',
  'https://rpaengr.com/an-interns-perspective-boston-universitys-mama-bear/'
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles metadata
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const responses = await Promise.all(
          initialArticleUrls.map((url) =>
            fetch(`/api/fetch-metadata?url=${encodeURIComponent(url)}`)
              .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json().then(data => ({
                  ...data,
                  url: url,
                  date: new Date(data.date) // Convert date string to Date object
                }));
              })
          )
        );

        setArticles(responses);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchArticles();
  }, []);
  

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Whitney, sans-serif',
      maxWidth: '100vw',
      margin: '0 auto',
      backgroundColor: '#FAFAFA'
    }}>
      {/* Header Section */}
      <div style={{ 
        marginBottom: '60px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#CC0000', 
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '16px'
        }}>
          Welcome
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#555',
          maxWidth: '80vw',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Access cutting-edge autonomous research technology from anywhere in the world. The BEAR Platform connects you directly to Boston University's 
          revolutionary robotic system that combines 3D printing, automated testing, and Bayesian optimization to discover optimal mechanical designs.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: '40px'
      }}>
        {/* Articles Section */}
        <div>
          <h2 style={{ 
            color: '#CC0000', 
            marginBottom: '30px',
            fontSize: '1.75rem',
            fontWeight: '600',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Latest Articles
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              backgroundColor: '#CC0000'
            }}></span>
          </h2>

          { isLoading ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                margin: '0 auto 20px',
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #CC0000',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p>Loading articles...</p>
            </div>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : articles.length === 0 ? (
            <p>No articles found</p>
          ) : (
            articles.map((article, index) => (
              <a 
                key={index}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'block'
                }}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                    display: 'flex',
                    gap: '24px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }}
                >
                  {/* Left side - Image */}
                  <div style={{ flex: '0 0 200px' }}>
                    {article.image ? (
                      <img
                        src={article.image}
                        alt="Article thumbnail"
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <div 
                        style={{
                          width: '100%',
                          height: '150px',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 12px 0', 
                      color: '#222',
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      lineHeight: '1.4'
                    }}>
                      {article.title}
                    </h3>
                    <p style={{ 
                      margin: '0 0 16px 0',
                      color: '#555',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {article.description}
                    </p>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: '500',
                      color: '#CC0000',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Read more
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{marginLeft: '4px'}}>
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Sidebar Section */}
        <div>
          <h2 style={{ 
            color: '#CC0000', 
            marginBottom: '30px',
            fontSize: '1.75rem',
            fontWeight: '600',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Quick Links
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '60px',
              height: '3px',
              backgroundColor: '#CC0000'
            }}></span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '30px'
          }}>
            {['Account', 'Library', 'Status', 'Leaderboard'].map((item, i) => (
              <a
                key={i}
                href={item.toLowerCase() === 'status' ? '/pages/bear-status' : `/pages/${item.toLowerCase()}`}
                style={{ 
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.1)';
                  e.currentTarget.style.backgroundColor = '#CC0000';
                  e.currentTarget.style.color = 'white';
                  const h3Element = e.currentTarget.querySelector('h3');
                  if (h3Element) {
                    h3Element.style.color = 'white';
                  }
                  const pElement = e.currentTarget.querySelector('p');
                  if (pElement) {
                    pElement.style.color = 'white';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#333';
                  const h3Element = e.currentTarget.querySelector('h3');
                  if (h3Element) {
                    h3Element.style.color = 'black';
                  }
                  const pElement = e.currentTarget.querySelector('p');
                  if (pElement) {
                    pElement.style.color = 'black';
                  }
                }}
                >
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    color: 'black',
                    transition: 'color 0.3s ease'
                  }}>{item}</h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.9rem',
                    opacity: 0.8,
                    textDecoration: 'none',
                    color: 'black',
                    transition: 'color 0.3s ease'
                  }}>Explore {item}</p>
                </div>
              </a>
            ))}
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              marginTop: '70px' 
            }}
          >
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>New Experiment</h3>
            <p style={{
              margin: '0 0 20px 0',
              fontSize: '0.95rem',
              color: '#555',
              lineHeight: '1.6'
            }}>Design your prototype by adjusting parameters to create a custom 3D model, then submit it to our robot for printing and testing.</p>
            <a 
              href="/account/newexp" 
              style={{ 
                color: 'white',
                backgroundColor: '#CC0000', 
                textDecoration: 'none',
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#AA0000';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#CC0000';
              }}
            >
              Create Model
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
