import os
import zipfile
import requests
import minsearch

# 1. Скачиваем архив, если его еще нет
zip_url = "https://github.com/jlowin/fastmcp/archive/refs/heads/main.zip"
zip_filename = "fastmcp.zip"

if not os.path.exists(zip_filename):
    print("Downloading archive...")
    response = requests.get(zip_url)
    with open(zip_filename, "wb") as f:
        f.write(response.content)

# 2. Читаем .md и .mdx файлы из архива
documents = []

with zipfile.ZipFile(zip_filename, "r") as z:
    for file_info in z.infolist():
        filename = file_info.filename
        
        # Проверяем расширения
        if filename.endswith(".md") or filename.endswith(".mdx"):
            # Пропускаем папки (бывают пустые записи для директорий)
            if file_info.is_dir():
                continue
                
            with z.open(file_info) as f:
                content = f.read().decode("utf-8")
                
                # Убираем первую часть пути (fastmcp-main/...)
                # Например: fastmcp-main/docs/welcome.md -> docs/welcome.md
                parts = filename.split("/", 1)
                if len(parts) > 1:
                    clean_filename = parts[1]
                else:
                    clean_filename = filename

                documents.append({
                    "filename": clean_filename,
                    "content": content
                })

# 3. Индексируем через minsearch
# Указываем поля: text_fields — по чему ищем, keyword_fields — метаданные
index = minsearch.Index(
    text_fields=["content"],
    keyword_fields=["filename"]
)

index.fit(documents)

# 4. Функция поиска
def search(query):
    results = index.search(
        query=query,
        num_results=5
    )
    return results

# 5. Тестируем запрос "demo"
if __name__ == "__main__":
    query = "demo"
    results = search(query)
    
    if results:
        print(f"Top result for '{query}':")
        print(results[0]['filename'])
    else:
        print("No results found.")
