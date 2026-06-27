import pandas as pd

fake_df = pd.read_csv("Fake.csv")
true_df = pd.read_csv("True.csv")

print("Fake News Rows:", len(fake_df))
print("Real News Rows:", len(true_df))

print("\nFake Columns:")
print(fake_df.columns)

print("\nReal Columns:")
print(true_df.columns)