from turtle import color
import pandas as pd
from matplotlib import pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

# df = pd.DataFrame(iris.data, columns=iris.feature_names)
# df['target'] = iris.target
# df['flower_names'] = df.target.apply(lambda x: iris.target_names[x])
# print("These are the traget names ", iris.target_names)
# print(df[df.target==1].head())



#scatter plot
# plt.xlabel('sepal length (cm)')
# plt.ylabel('sepal width (cm)')
# plt.scatter(df0['sepal length (cm)'], df0['sepal width (cm)'], color='green', marker="+")
# plt.scatter(df1['sepal length (cm)'], df1['sepal width (cm)'], color='red', marker="+")

# plt.xlabel('petal length (cm)')
# plt.ylabel('petal width (cm)')
# plt.scatter(df0['petal length (cm)'], df0['petal width (cm)'], color='green', marker="+")
# plt.scatter(df1['petal length (cm)'], df1['petal width (cm)'], color='red', marker="+")

# plt.show()

x = df.drop(['target', 'flower_names'], axis="columns")
y = df.target
x_train, x_test, y_train, y_test =  train_test_split(x, y, test_size=0.2)

model = SVC()
print(model)
model.fit(x_train, y_train)
ans = model.score(x_test, y_test)
print(ans)