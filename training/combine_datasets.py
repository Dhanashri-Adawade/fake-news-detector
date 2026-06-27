import pandas as pd

# Old Dataset
fake_df = pd.read_csv("Fake.csv")
true_df = pd.read_csv("True.csv")

fake_df["label"] = 0
true_df["label"] = 1

old_dataset = pd.concat(
    [fake_df[["text", "label"]],
     true_df[["text", "label"]]],
    ignore_index=True
)

# WELFake Dataset
wel_df = pd.read_csv("../dataset/WELFake_Dataset.csv")

wel_df = wel_df[["text", "label"]]

# new
wel_df["label"] = wel_df["label"].map({0: 1, 1: 0})


# Combine both datasets
combined_df = pd.concat(
    [old_dataset, wel_df],
    ignore_index=True
)

# Remove rows with missing text
combined_df = combined_df.dropna(subset=["text"])

# Save
combined_df.to_csv(
    "combined_dataset.csv",
    index=False
)

print("Combined Dataset Created")
print("Total Rows:", len(combined_df))
print("\nLabel Counts:")
print(combined_df["label"].value_counts())