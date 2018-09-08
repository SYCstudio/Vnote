# [POI2008]POC-Trains
[BZOJ1125 Luogu3471]

给出n个字符串，长度均为len；  
有m次操作，每次将两个字符交换；  
求每个字符串在任何时点上，与相同的它最多的字符串个数；

字符串相同的比较可以用 Hash ，那么确定相同的 Hash 值的个数并且实时更新可以用可并堆来实现。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
using namespace std;

#define ll long long
#define ull unsigned long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1510;
const int maxL=120;
const ull base=29;
const int inf=2147483647;

class Heap
{
public:
	int fa,ls,rs,size,rdis;
	int Ans,mx;
};

int n,L,m;
char str[maxN][maxL];
ull Hash[maxN],Pow[maxN];
int rcnt,St[maxN];
Heap H[maxN];
map<ull,int> Rt;

void PushDown(int u);
void Update(int u);
int Merge(int u,int v);
void Erase(int x);
void Insert(int x);

int main(){
	Pow[0]=1;for (int i=1;i<maxN;i++) Pow[i]=Pow[i-1]*base;
	scanf("%d%d%d",&n,&L,&m);rcnt=n;
	for (int i=1;i<=n;i++) scanf("%s",str[i]+1);
	for (int i=1;i<=n;i++){
		Hash[i]=0;H[i].size=H[i].Ans=1;
		for (int j=1;j<=L;j++) Hash[i]=Hash[i]*base+str[i][j]-'a';
		Insert(i);
	}

	while (m--){
		int p1,p2,w1,w2;
		scanf("%d%d%d%d",&p1,&w1,&p2,&w2);
		Erase(p1);if (p1!=p2) Erase(p2);

		Hash[p1]-=Pow[L-w1]*(str[p1][w1]-'a');
		Hash[p2]-=Pow[L-w2]*(str[p2][w2]-'a');
		swap(str[p1][w1],str[p2][w2]);
		Hash[p1]+=Pow[L-w1]*(str[p1][w1]-'a');
		Hash[p2]+=Pow[L-w2]*(str[p2][w2]-'a');

		Insert(p1);if (p1!=p2) Insert(p2);
	}

	for (int i=1;i<=n;i++) Erase(i);

	for (int i=1;i<=n;i++) printf("%d\n",H[i].Ans);
	return 0;
}

void PushDown(int u){
	if (H[u].ls){
		int v=H[u].ls;
		H[v].Ans=max(H[v].Ans,H[u].mx);
		H[v].mx=max(H[v].mx,H[u].mx);
	}
	if (H[u].rs){
		int v=H[u].rs;
		H[v].Ans=max(H[v].Ans,H[u].mx);
		H[v].mx=max(H[v].mx,H[u].mx);
	}
	H[u].mx=0;
	return;
}

void Update(int u){
	H[u].size=H[H[u].ls].size+H[H[u].rs].size+1;
	return;
}

int Merge(int u,int v){
	if (u==0) return v;
	if (v==0) return u;
	PushDown(u);PushDown(v);
	H[u].rs=Merge(H[u].rs,v);if (H[u].rs) H[H[u].rs].fa=u;Update(u);
	if (H[H[u].ls].rdis<H[H[u].rs].rdis) swap(H[u].ls,H[u].rs);
	H[u].rdis=H[H[u].rs].rdis+1;
	return u;
}

void Erase(int x){
	int now=x,top=0;
	while (now) St[++top]=now,now=H[now].fa;
	while (top) PushDown(St[top--]);
	if (H[x].fa==0){
		int ls=H[x].ls,rs=H[x].rs;
		H[ls].fa=H[rs].fa=H[x].ls=H[x].rs=0;
		Rt[Hash[x]]=Merge(ls,rs);Update(x);
	}
	else{
		int ls=H[x].ls,rs=H[x].rs,fa=H[x].fa;H[ls].fa=H[rs].fa=H[x].ls=H[x].rs=H[x].fa=0;
		int r=Merge(ls,rs);if (r!=0) H[r].fa=fa;
		if (H[fa].ls==x) H[fa].ls=r;
		else H[fa].rs=r;
		int now=fa;
		while (now) Update(now),now=H[now].fa;
		Update(x);
	}
	return;
}

void Insert(int x){
	if (Rt.count(Hash[x])==0) Rt[Hash[x]]=x;
	else Rt[Hash[x]]=Merge(Rt[Hash[x]],x);
	H[Rt[Hash[x]]].mx=max(H[Rt[Hash[x]]].mx,H[Rt[Hash[x]]].size);
	H[Rt[Hash[x]]].Ans=max(H[Rt[Hash[x]]].Ans,H[Rt[Hash[x]]].mx);
	return;
}
```