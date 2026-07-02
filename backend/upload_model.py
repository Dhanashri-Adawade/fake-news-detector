from huggingface_hub import HfApi

api = HfApi()

api.upload_folder(
    folder_path="../model/fake_news_distilbert",
    repo_id="Dhanashri-Adawade/fake-news-distilbert",
    repo_type="model",
)

print("Upload complete!")