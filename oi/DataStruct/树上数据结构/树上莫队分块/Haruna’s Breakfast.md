# Haruna’s Breakfast
[BZOJ4129]

Haruna每天都会给提督做早餐！ 这天她发现早饭的食材被调皮的 Shimakaze放到了一棵树上，每个结点都有一样食材，Shimakaze要考验一下她。每个食材都有一个美味度，Shimakaze会进行两种操作：  
1、修改某个结点的食材的美味度。  
2、对于某条链，询问这条链的美味度集合中，最小的未出现的自然数是多少。即mex值。  
请你帮帮Haruna吧。

树上莫队分块，大于$n$的权值可以直接扔掉，然后用$set$维护剩余的位置。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
#include<set>
#include<queue>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define Find(x) (lower_bound(&Num[1],&Num[numcnt+1],x)-Num)
#define IL inline

const int maxN=50010*3;
const int maxM=maxN<<1;
const int maxBit=18;
const int inf=2147483647;

class Question
{
public:
	int u,v,id,tim;
};

class Modify
{
public:
	int pos,p,q;
};

int n,m;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
int numcnt,Num[maxN*2],Val[maxN],VVal[maxN];
int blocksize,blockcnt,Belong[maxN],top,St[maxN],Depth[maxN],Fa[maxN];
int dfncnt,Seq[maxBit][maxN*8],fst[maxN],lst[maxN],Log[maxN*8];
Question Qn[maxN];
Modify My[maxN];
set<int> AnsSet;
int Ans[maxN],Cnt[maxN];
bool vis[maxN];

IL void Add_Edge(int u,int v);
void dfs(int u,int fa);
bool cmp(Question A,Question B);
IL int LCA(int u,int v);
IL void TimAdd(int t);
IL void TimBack(int t);
IL void Move(int u,int v);
IL void Reverse(int u);
IL void Insert(int key);
IL void Delete(int key);

int main()
{
	for (int i=1;i<maxN*3;i++) Log[i]=log2(i);
	mem(Head,-1);
	scanf("%d%d",&n,&m);numcnt=n;blocksize=pow(n,0.5);
	for (int i=1;i<=n;i++) scanf("%d",&Val[i]),Num[i]=Val[i],VVal[i]=Val[i];
	for (int i=1;i<n;i++)
	{
		int u,v;scanf("%d%d",&u,&v);
		Add_Edge(u,v);
	}

	int qcnt=0,tcnt=0;
	for (int i=1;i<=m;i++)
	{
		int opt;scanf("%d",&opt);
		if (opt==0)
		{
			int p,k;scanf("%d%d",&p,&k);
			My[++tcnt]=((Modify){p,Val[p],k});
			Val[p]=k;Num[++numcnt]=k;
		}
		if (opt==1)
		{
			int u,v;scanf("%d%d",&u,&v);
			Qn[++qcnt]=((Question){u,v,qcnt,tcnt});
		}
	}

	for (int i=1;i<=n;i++) Val[i]=VVal[i];
	
	sort(&Num[1],&Num[numcnt+1]);numcnt=unique(&Num[1],&Num[numcnt+1])-Num-1;

	for (int i=1;i<=n;i++) Val[i]=Find(Val[i]);
	for (int i=1;i<=tcnt;i++) My[i].p=Find(My[i].p),My[i].q=Find(My[i].q);

	Depth[1]=0;
	dfs(1,0);
	while (top) Belong[St[top--]]=blockcnt;
	for (int i=1;i<=qcnt;i++) if (Belong[Qn[i].u]>Belong[Qn[i].v]) swap(Qn[i].u,Qn[i].v);
	for (int i=1;i<maxBit;i++)
		for (int j=1;j<=dfncnt;j++)
			if (Depth[Seq[i-1][j]]<=Depth[Seq[i-1][j+(1<<(i-1))]]) Seq[i][j]=Seq[i-1][j];
			else Seq[i][j]=Seq[i-1][j+(1<<(i-1))];
	Insert(0);
	for (int i=1;i<=numcnt;i++){
		if (Num[i]>n) break;
		Insert(Num[i]);
		if (Num[i]!=0) Insert(Num[i]-1);
		Insert(Num[i]+1);
	}

	sort(&Qn[1],&Qn[qcnt+1],cmp);

	int tim=0,u=1,v=1;
	for (int i=1;i<=qcnt;i++)
	{
		while (tim<Qn[i].tim) TimAdd(++tim);
		while (tim>Qn[i].tim) TimBack(tim--);
		Move(u,Qn[i].u);Move(v,Qn[i].v);
		u=Qn[i].u;v=Qn[i].v;
		int lca=LCA(u,v);
		Reverse(lca);
		Ans[Qn[i].id]=(*AnsSet.begin());
		Reverse(lca);
	}

	for (int i=1;i<=qcnt;i++) printf("%d\n",Ans[i]);
	return 0;
}

IL void Add_Edge(int u,int v){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
	Next[++edgecnt]=Head[v];Head[v]=edgecnt;V[edgecnt]=u;
	return;
}

void dfs(int u,int fa)
{
	int nowtop=top;Seq[0][++dfncnt]=u;fst[u]=dfncnt;
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa)
		{
			Depth[V[i]]=Depth[u]+1;Fa[V[i]]=u;
			dfs(V[i],u);Seq[0][++dfncnt]=u;
			if (top-nowtop>=blocksize)
			{
				blockcnt++;
				while (top!=nowtop) Belong[St[top--]]=blockcnt;
			}
		}
	lst[u]=dfncnt;
	St[++top]=u;return;
}

bool cmp(Question A,Question B){
	if (Belong[A.u]==Belong[B.u]) return Belong[A.v]<Belong[B.v];
	else return Belong[A.u]<Belong[B.u];
}

IL int LCA(int u,int v)
{
	int l=min(fst[u],fst[v]),r=max(lst[u],lst[v]);
	int lg=Log[r-l+1];
	if (Depth[Seq[lg][l]]<=Depth[Seq[lg][r-(1<<lg)+1]]) return Seq[lg][l];
	else return Seq[lg][r-(1<<lg)+1];
}

IL void TimAdd(int t)
{
	if (vis[My[t].pos])
	{
		Cnt[My[t].p]--;if (Cnt[My[t].p]==0) Insert(Num[My[t].p]);
		Cnt[My[t].q]++;if (Cnt[My[t].q]==1) Delete(Num[My[t].q]);
	}
	Val[My[t].pos]=My[t].q;
	return;
}

IL void TimBack(int t)
{
	if (vis[My[t].pos])
	{
		Cnt[My[t].q]--;if (Cnt[My[t].q]==0) Insert(Num[My[t].q]);
		Cnt[My[t].p]++;if (Cnt[My[t].p]==1) Delete(Num[My[t].p]);
	}
	Val[My[t].pos]=My[t].p;
	return;
}

IL void Move(int u,int v)
{
	int lca=LCA(u,v);
	while (u!=lca) Reverse(u),u=Fa[u];
	while (v!=lca) Reverse(v),v=Fa[v];
	return;
}

IL void Reverse(int u)
{
	if (vis[u]==0){
		Cnt[Val[u]]++;
		if (Cnt[Val[u]]==1) Delete(Num[Val[u]]);
	}
	else{
		Cnt[Val[u]]--;
		if (Cnt[Val[u]]==0) Insert(Num[Val[u]]);
	}
	vis[u]^=1;return;
}

IL void Insert(int key)
{
	if (key>n) return;
	AnsSet.insert(key);return;
}

IL void Delete(int key)
{
	if (key>n) return;
	AnsSet.erase(key);return;
}
```