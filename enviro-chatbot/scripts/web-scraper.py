import requests
from bs4 import BeautifulSoup
import json
import time
from urllib.parse import urljoin, urlparse
import re

class EnviroTestConstructScraper:
    def __init__(self, base_url="https://envirotestconstruct.com"):
        self.base_url = base_url
        self.scraped_content = []
        self.visited_urls = set()
        
    def clean_text(self, text):
        """Clean and normalize text content"""
        # Remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep basic punctuation
        text = re.sub(r'[^\w\s.,!?;:()\-]', '', text)
        return text.strip()
    
    def extract_content(self, url):
        """Extract meaningful content from a webpage"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Extract title
            title = soup.find('title')
            title_text = title.get_text() if title else ""
            
            # Extract main content areas
            content_selectors = [
                'main', 'article', '.content', '#content', 
                '.main-content', '.page-content', 'section'
            ]
            
            content_text = ""
            for selector in content_selectors:
                elements = soup.select(selector)
                for element in elements:
                    content_text += element.get_text() + " "
            
            # If no specific content areas found, get body text
            if not content_text.strip():
                body = soup.find('body')
                if body:
                    content_text = body.get_text()
            
            # Clean the extracted text
            clean_content = self.clean_text(content_text)
            
            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc.get('content', '') if meta_desc else ''
            
            return {
                'url': url,
                'title': self.clean_text(title_text),
                'description': self.clean_text(description),
                'content': clean_content,
                'word_count': len(clean_content.split())
            }
            
        except Exception as e:
            print(f"Error scraping {url}: {str(e)}")
            return None
    
    def chunk_content(self, content, chunk_size=500, overlap=50):
        """Split content into overlapping chunks"""
        words = content.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if len(chunk.strip()) > 100:  # Only keep substantial chunks
                chunks.append(chunk.strip())
        
        return chunks
    
    def scrape_site(self):
        """Main scraping function"""
        # Define key pages to scrape
        key_pages = [
            "",  # Homepage
            "/services",
            "/about",
            "/contact",
            "/site-assessment",
            "/environmental-monitoring", 
            "/green-building-compliance",
            "/contamination-detection",
            "/air-quality-monitoring",
            "/soil-testing",
            "/groundwater-analysis"
        ]
        
        print("Starting to scrape Enviro Test Construct website...")
        
        for page in key_pages:
            url = urljoin(self.base_url, page)
            if url not in self.visited_urls:
                print(f"Scraping: {url}")
                content_data = self.extract_content(url)
                
                if content_data and content_data['word_count'] > 50:
                    # Chunk the content
                    chunks = self.chunk_content(content_data['content'])
                    
                    for i, chunk in enumerate(chunks):
                        chunk_data = {
                            'id': f"{urlparse(url).path.replace('/', '_') or 'home'}_{i}",
                            'source_url': url,
                            'title': content_data['title'],
                            'description': content_data['description'],
                            'content': chunk,
                            'chunk_index': i,
                            'total_chunks': len(chunks),
                            'category': self.categorize_content(url, chunk)
                        }
                        self.scraped_content.append(chunk_data)
                
                self.visited_urls.add(url)
                time.sleep(1)  # Be respectful to the server
        
        print(f"Scraping completed. Collected {len(self.scraped_content)} content chunks.")
        return self.scraped_content
    
    def categorize_content(self, url, content):
        """Categorize content based on URL and content analysis"""
        url_lower = url.lower()
        content_lower = content.lower()
        
        if 'site-assessment' in url_lower or 'assessment' in content_lower:
            return 'site-assessment'
        elif 'monitoring' in url_lower or 'monitoring' in content_lower:
            return 'environmental-monitoring'
        elif 'green' in url_lower or 'compliance' in content_lower:
            return 'green-building'
        elif 'contamination' in url_lower or 'contamination' in content_lower:
            return 'contamination-detection'
        elif 'air' in content_lower or 'air-quality' in url_lower:
            return 'air-quality'
        elif 'soil' in content_lower or 'soil' in url_lower:
            return 'soil-testing'
        elif 'water' in content_lower or 'groundwater' in content_lower:
            return 'groundwater'
        elif 'about' in url_lower or 'company' in content_lower:
            return 'company-info'
        else:
            return 'general'
    
    def save_to_json(self, filename="enviro_content.json"):
        """Save scraped content to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.scraped_content, f, indent=2, ensure_ascii=False)
        print(f"Content saved to {filename}")

# Run the scraper
if __name__ == "__main__":
    scraper = EnviroTestConstructScraper()
    content = scraper.scrape_site()
    scraper.save_to_json()
    
    # Print summary
    print(f"\nScraping Summary:")
    print(f"Total chunks: {len(content)}")
    
    categories = {}
    for chunk in content:
        cat = chunk['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("Content by category:")
    for cat, count in categories.items():
        print(f"  {cat}: {count} chunks")
