# SvT
[BZOJ3879]

(我并不想告诉你题目名字是什么鬼)  
有一个长度为n的仅包含小写字母的字符串S,下标范围为[1,n].  
现在有若干组询问,对于每一个询问,我们给出若干个后缀(以其在S中出现的起始位置来表示),求这些后缀两两之间的LCP (LongestCommonPrefix)的长度之和.一对后缀之间的LCP长度仅统计一遍.

反建后缀自动机得到$fail$树，然后对每一次询问建出虚树，在虚树上$DP$

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=505000*2;
const ll Mod=23333333333333333;
const int maxAlpha=26;
const int inf=2147483647;

class Node{
public:
	int son[maxAlpha],len,fail;
};

int n,m;
char str[maxN];
int nodecnt=1,last=1;
Node S[maxN];
int Pos[maxN];
vector<int> To[maxN];
int dfncnt,fst[maxN],lst[maxN],Id[maxN];
int Size[maxN],Hson[maxN],Top[maxN],Fa[maxN],Depth[maxN];
int Seq[maxN],Mark[maxN],F[maxN],St[maxN],Tot[maxN];

int Insert(int c);
void dfs1(int u);
void dfs2(int u,int top);
int LCA(int u,int v);
bool cmp(int a,int b);

int main()
{
	scanf("%d%d",&n,&m);
	scanf("%s",str+1);
	for (int i=n;i>=1;i--) Pos[i]=Insert(str[i]-'a');

	for (int i=2;i<=nodecnt;i++) To[S[i].fail].push_back(i);
	
	Depth[1]=1;
	dfs1(1);
	dfs2(1,1);

	while (m--){
		int cnt;scanf("%d",&cnt);
		for (int i=1;i<=cnt;i++){
			int p;scanf("%d",&p);Seq[i]=Pos[p];Mark[Seq[i]]=1;
		}
		sort(&Seq[1],&Seq[cnt+1],cmp);
		for (int i=1;i<cnt;i++) Seq[cnt+i]=LCA(Seq[i],Seq[i+1]);
		sort(&Seq[1],&Seq[cnt+cnt],cmp);cnt=unique(&Seq[1],&Seq[cnt+cnt])-Seq-1;

		int top=0;
		ll Ans=0;
		for (int i=1;i<=cnt;i++){
			while ((top)&&(fst[Seq[i]]>lst[St[top]])){
				Ans=(Ans+1ll*S[St[top]].len*Tot[St[top]]%Mod)%Mod;
				Tot[St[top-1]]=(Tot[St[top-1]]+Mark[St[top-1]]*Mark[St[top]]%Mod)%Mod;
				Mark[St[top-1]]+=Mark[St[top]];
				top--;
			}
			St[++top]=Seq[i];
		}

		while (top){
			Ans=(Ans+1ll*S[St[top]].len*Tot[St[top]]%Mod)%Mod;
			Tot[St[top-1]]=(Tot[St[top-1]]+Mark[St[top-1]]*Mark[St[top]]%Mod)%Mod;
			Mark[St[top-1]]+=Mark[St[top]];
			top--;
		}

		printf("%lld\n",Ans);
		for (int i=1;i<=cnt;i++) Mark[Seq[i]]=Tot[Seq[i]]=0;
	}
	return 0;
}

int Insert(int c){
	int np=++nodecnt,p=last;last=nodecnt;
	S[np].len=S[p].len+1;
	while ((p!=0)&&(S[p].son[c]==0)) S[p].son[c]=np,p=S[p].fail;
	if (p==0) S[np].fail=1;
	else{
		int q=S[p].son[c];
		if (S[q].len==S[p].len+1) S[np].fail=q;
		else{
			int nq=++nodecnt;S[nq]=S[q];
			S[q].fail=S[np].fail=nq;S[nq].len=S[p].len+1;
			while ((p!=0)&&(S[p].son[c]==q)) S[p].son[c]=nq,p=S[p].fail;
		}
	}
	return last;
}

void dfs1(int u){
	Id[fst[u]=++dfncnt]=u;Size[u]=1;Hson[u]=0;
	for (int sz=To[u].size(),i=0;i<sz;i++){
		Fa[To[u][i]]=u;Depth[To[u][i]]=Depth[u]+1;
		dfs1(To[u][i]);Size[u]+=Size[To[u][i]];
		if (Size[Hson[u]]<Size[To[u][i]]) Hson[u]=To[u][i];
	}
	lst[u]=dfncnt;return;
}

void dfs2(int u,int top){
	Top[u]=top;
	if (Hson[u]==0) return;
	dfs2(Hson[u],top);
	for (int sz=To[u].size(),i=0;i<sz;i++)
		if (To[u][i]!=Hson[u])
			dfs2(To[u][i],To[u][i]);
	return;
}

int LCA(int u,int v){
	while (Top[u]!=Top[v]){
		if (Depth[Top[u]]<Depth[Top[v]]) swap(u,v);
		u=Fa[Top[u]];
	}
	if (Depth[u]>Depth[v]) swap(u,v);
	return u;
}

bool cmp(int a,int b){
	return fst[a]<fst[b];
}
```