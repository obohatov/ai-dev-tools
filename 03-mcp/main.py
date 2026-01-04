import requests
from fastmcp import FastMCP

# Создаем сервер
mcp = FastMCP("Homework Server")

# 1. Сначала определим обычную функцию, чтобы её можно было вызывать в коде
def scrape_jina(url: str) -> str:
    jina_url = f"https://r.jina.ai/{url}"
    response = requests.get(jina_url)
    return response.text

# 2. А теперь регистрируем её как инструмент для MCP
@mcp.tool()
def fetch_web_content(url: str) -> str:
    """Извлекает содержимое страницы через Jina Reader"""
    return scrape_jina(url)

if __name__ == "__main__":
    # --- Блок для ответов на вопросы ДЗ ---
    # Вызываем нашу обычную функцию scrape_jina, а не декоратор
    
    print("Fetching data for questions...")

    # Q3: Проверяем длину текста для репозитория minsearch
    q3_url = "https://github.com/alexeygrigorev/minsearch"
    q3_content = scrape_jina(q3_url)
    print(f"QUESTION 3: Length of content is {len(q3_content)}")

    # Q4: Считаем слово 'data' на главной DataTalks.Club
    q4_url = "https://datatalks.club/"
    q4_content = scrape_jina(q4_url).lower()
    count = q4_content.count("data")
    print(f"QUESTION 4: The word 'data' appears {count} times")

    # Q2: Запуск сервера
    print("\nStarting MCP server for Question 2...")
    # Если запуск в Codespaces может блокировать консоль, 
    # убедись, что ты записал ответы Q3 и Q4 выше.
    mcp.run()
