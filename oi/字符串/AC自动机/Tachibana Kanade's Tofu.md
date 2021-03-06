# Tachibana Kanade's Tofu
[CF434C]

Tachibana Kanade likes Mapo Tofu very much. One day, the canteen cooked all kinds of tofu to sell, but not all tofu is Mapo Tofu, only those spicy enough can be called Mapo Tofu.  
Each piece of tofu in the canteen is given a m-based number, all numbers are in the range [l, r] (l and r being m-based numbers), and for every m-based integer in the range [l, r], there exists a piece of tofu with that number.  
To judge what tofu is Mapo Tofu, Tachibana Kanade chose n m-based number strings, and assigned a value to each string. If a string appears in the number of a tofu, the value of the string will be added to the value of that tofu. If a string appears multiple times, then the value is also added that many times. Initially the value of each tofu is zero.  
Tachibana Kanade considers tofu with values no more than k to be Mapo Tofu. So now Tachibana Kanade wants to know, how many pieces of tofu are Mapo Tofu?

定义这里的数字串为$m$进制下的数字。给定一个数字串集合，每一个数字串有一个权值。现在要求构造$[L,R]$之间的数字串，每出现一个集合中的串，则加上其权值，求构造的这种字符串权值不超过$K$的方案数。

在$AC$自动机上数位$DP$。$F[0/1][i][j][k]$表示构造到第$i$位，当前在$AC$自动机上节点$j$，当前权值和为$k$的方案数，$[0/1]$表示是危险态还是安全态。

```cpp
#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=220;
const int maxAlpha=21;
const int maxK=510;
const int Mod=1e9+7;
const int inf=2147483647;

int n,m,K;
int nodecnt=0,root=0;
int son[maxAlpha][maxN],fail[maxN],Val[maxN];
int Llen,L[maxN],Rlen,R[maxN],Seq[maxN];
int F[2][maxN][maxN][maxK];
queue<int> Q;

void Insert(int len);
void GetFail();
void Add(int &x,int y);
int Calc(int len,int Up[]);

int main(){
	scanf("%d%d%d",&n,&m,&K);
	scanf("%d",&Llen);
	for (int i=1;i<=Llen;i++) scanf("%d",&L[i]);
	scanf("%d",&Rlen);
	for (int i=1;i<=Rlen;i++) scanf("%d",&R[i]);

	for (int i=1;i<=n;i++){
		int len;scanf("%d",&len);
		for (int j=1;j<=len;j++) scanf("%d",&Seq[j]);
		Insert(len);
	}
	GetFail();

	int nowlen=Llen;
	while (L[nowlen]==0) L[nowlen--]=m-1;
	L[nowlen]--;
	if (L[1]==0){
		for (int i=1;i<Llen;i++) L[i]=L[i+1];Llen--;
	}

	printf("%d\n",(Calc(Rlen,R)+Mod-Calc(Llen,L))%Mod);

	return 0;
}

void Insert(int len){
	int now=root;
	for (int i=1;i<=len;i++){
		if (son[Seq[i]][now]==0) son[Seq[i]][now]=++nodecnt;
		now=son[Seq[i]][now];
	}
	int val;scanf("%d",&val);
	Val[now]+=val;return;
}

void GetFail(){
	while (!Q.empty()) Q.pop();
	for (int i=0;i<m;i++) if (son[i][0]) Q.push(son[i][0]);
	while (!Q.empty()){
		int u=Q.front();Q.pop();
		for (int i=0;i<m;i++)
			if (son[i][u]){
				fail[son[i][u]]=son[i][fail[u]];
				Val[son[i][u]]+=Val[fail[son[i][u]]];
				Q.push(son[i][u]);
			}
			else son[i][u]=son[i][fail[u]];
	}
	return;
}

void Add(int &x,int y){
	x=(x+y)%Mod;return;
}

int Calc(int len,int Up[]){
	if (len==0) return 0;
	mem(F,0);
	for (int i=1;i<=Up[1];i++)
		if (Val[son[i][0]]<=K) Add(F[(i==Up[1])][1][son[i][0]][Val[son[i][0]]],1);
	for (int i=2;i<=len;i++)
		for (int j=1;j<m;j++)
			if (Val[son[j][0]]<=K) Add(F[0][i][son[j][0]][Val[son[j][0]]],1);
	for (int i=1;i<len;i++)
		for (int j=0;j<=nodecnt;j++)
			for (int k=0;k<=K;k++)
				if ((F[0][i][j][k])||(F[1][i][j][k]))
					for (int p=0;p<m;p++){
						int c=son[p][j];
						if (k+Val[c]>K) continue;
						Add(F[0][i+1][c][k+Val[c]],F[0][i][j][k]);
						if (p<Up[i+1]) Add(F[0][i+1][c][k+Val[c]],F[1][i][j][k]);
						if (p==Up[i+1]) Add(F[1][i+1][c][k+Val[c]],F[1][i][j][k]);
					}
	int ret=0;
	for (int i=0;i<=nodecnt;i++) for (int j=0;j<=K;j++) Add(ret,(F[0][len][i][j]+F[1][len][i][j])%Mod);
	return ret;
}
```