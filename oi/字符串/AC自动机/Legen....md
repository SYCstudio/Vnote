# Legen...
[CF696D]

Barney was hanging out with Nora for a while and now he thinks he may have feelings for her. Barney wants to send her a cheesy text message and wants to make her as happy as possible.  
![CF696D](_v_images/_cf696d_1533132261_688395938.png)  
Initially, happiness level of Nora is 0. Nora loves some pickup lines like "I'm falling for you" and stuff. Totally, she knows n pickup lines, each consisting only of lowercase English letters, also some of them may be equal (in writing, but different in pronouncing or meaning though). Every time Nora sees i-th pickup line as a consecutive subsequence of Barney's text message her happiness level increases by ai. These substrings may overlap, for example, Nora will see the pickup line aa twice and the pickup line ab once in text message aaab.

给出一个串的集合，每一个串有一个价值。现在要求构造出一个长度为$L$的字符串，集合中的串每出现一次就加上对应的价值。求最大化价值。

构建出$AC$自动机后，倍增$Floyed$求长度为$L$的最长路。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=210;
const int maxAlpha=26;
const int maxBit=48;
const int inf=2147483647;
const ll INF=1e16;

int n;
ll L;
int nodecnt=0,root=0;
int son[maxAlpha][maxN],fail[maxN],sum[maxN];
ll Mat[maxBit][maxN][maxN],Ans[maxN][maxN],Bp[maxN][maxN];
int Val[maxN];
char Input[maxN];
queue<int> Q;

void GetFail();
void Mul(int b);

int main(){
	scanf("%d%lld",&n,&L);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]);
	for (int i=1;i<=n;i++){
		scanf("%s",Input+1);
		int now=root,len=strlen(Input+1);
		for (int j=1;j<=len;j++){
			if (son[Input[j]-'a'][now]==0) son[Input[j]-'a'][now]=++nodecnt;
			now=son[Input[j]-'a'][now];
		}
		sum[now]+=Val[i];
	}

	GetFail();

	for (int k=0;k<maxBit;k++) for (int i=0;i<=nodecnt;i++) for (int j=0;j<=nodecnt;j++) Mat[k][i][j]=-INF;

	for (int i=0;i<=nodecnt;i++)
		for (int j=0;j<maxAlpha;j++){
			if (Mat[0][i][son[j][i]]==-INF) Mat[0][i][son[j][i]]=0;
			Mat[0][i][son[j][i]]+=sum[son[j][i]];
		}

	for (int i=0;i<=nodecnt;i++) for (int j=0;j<=nodecnt;j++) Ans[i][j]=Mat[0][i][j];

	for (int b=1;b<maxBit;b++)
		for (int k=0;k<=nodecnt;k++)
			for (int i=0;i<=nodecnt;i++)
				for (int j=0;j<=nodecnt;j++)
					Mat[b][i][j]=max(Mat[b][i][j],Mat[b-1][i][k]+Mat[b-1][k][j]);
	L--;
	for (int i=maxBit-1;i>=0;i--)
		if ((1ll<<i)&L) Mul(i);

	ll ans=-INF;
	for (int i=0;i<=nodecnt;i++) ans=max(ans,Ans[0][i]);

	printf("%lld\n",ans);

	return 0;
}

void GetFail(){
	for (int i=0;i<maxAlpha;i++) if (son[i][0]) Q.push(son[i][0]);
	while (!Q.empty()){
		int u=Q.front();Q.pop();
		for (int i=0;i<maxAlpha;i++)
			if (son[i][u]){
				fail[son[i][u]]=son[i][fail[u]];
				sum[son[i][u]]+=sum[fail[son[i][u]]];
				Q.push(son[i][u]);
			}
			else son[i][u]=son[i][fail[u]];
	}
	return;
}

void Mul(int b){
	for (int i=0;i<=nodecnt;i++) for (int j=0;j<=nodecnt;j++) Bp[i][j]=Ans[i][j],Ans[i][j]=-INF;
	for (int k=0;k<=nodecnt;k++)
		for (int i=0;i<=nodecnt;i++)
			for (int j=0;j<=nodecnt;j++)
				Ans[i][j]=max(Ans[i][j],Bp[i][k]+Mat[b][k][j]);
	return;
}
```