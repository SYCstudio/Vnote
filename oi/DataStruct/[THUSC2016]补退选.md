# [THUSC2016]补退选
[BZOJ4896 LOJ2291]

X是T大的一名老师，每年他都要教授许多学生基础的C++知识。在T大，每个学生在每学期的开学前都需要选课，每次选课一共分为三个阶段：预选，正选，补退选；其中“补退选”阶段最忙碌。

在补退选阶段，学生即可以选课，也可以退课。对于X老师来说，在补退选阶段可能发生以下两种事件：

1.	一个姓名为 $S$ 的学生选了他的课（姓名 $S$ 将出现在X的已选课学生名单中）

2.	一个姓名为 $S$ 的学生退了他的课（姓名 $S$ 将从X的已选课学生名单中移除）

同时，X老师对于有哪些学生选了他的课非常关心，所以他会不定时的查询已选课学生名单，每次查询的格式如下：
```plain
最早在哪个事件之后，姓名以S为前缀的学生数量超过了v
```

X老师看你骨骼惊奇，所以想用这个问题考考你，你当然不会畏惧，所以勇敢的接下了这个任务。

**注意1：学生的姓名可能相同，如果有 $p$ 个姓名相同的学生都选了X老师的课，则他们的姓名将出现在X老师的名单上 $p$ 次。**

**注意2：只有已经选了课的学生才会退课，如果姓名为 $S$ 的学生退课，则在他退课之前X老师的名单上一定有姓名 $S$。**

**注意3：选课，退课和查询都被定义为“事件”，“事件”的编号从1开始**

建立 Trie 树，对于每一个节点保存一个 vector 表示最早超过某个值的时间。由于每次人数的增减为 1 ，所以 vector 总元素个数不会超过字符串总长。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int maxT=1010000;
const int maxAlpha=20;
const int inf=2147483647;

int n;
int nodecnt=1,root=1;
int son[maxT][maxAlpha],cnt[maxT];
vector<int> Tim[maxT];
char Input[maxN];

void Insert(char *str,int key,int t);
int Query(char *str,int key);

int main(){
	scanf("%d",&n);
	int lstans=0;
	for (int ni=1;ni<=n;ni++){
		int opt;scanf("%d %s",&opt,Input+1);
		if (opt==1) Insert(Input,1,ni);
		else if (opt==2) Insert(Input,-1,ni);
		else{
			ll a,b,c;scanf("%lld%lld%lld",&a,&b,&c);
			int key=(a*abs(lstans)+b)%c;
			printf("%d\n",lstans=Query(Input,key));
		}
	}
	return 0;
}

void Insert(char *str,int key,int t){
	int len=strlen(str+1),now=1;
	for (int i=1;i<=len;i++){
		int c=str[i]-'a';
		if (son[now][c]==0){
			son[now][c]=++nodecnt;
			Tim[nodecnt].push_back(t);
		}
		now=son[now][c];cnt[now]+=key;
		if (cnt[now]>Tim[now].size()) Tim[now].push_back(t);
	}
	return;
}

int Query(char *str,int key){
	int len=strlen(str+1),now=1;
	for (int i=1;i<=len;i++){
		int c=str[i]-'a';
		if (son[now][c]==0) return -1;
		now=son[now][c];
	}
	if (Tim[now].size()-1<key) return -1;
	return Tim[now][key];
}
```