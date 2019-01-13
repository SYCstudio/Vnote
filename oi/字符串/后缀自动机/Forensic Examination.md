# Forensic Examination
[CF666E]

给定一个串$S$以及一个字符串数组$T[1..m]$，$q$次询问，每次问$S$的子串$S[p _ l..p _ r]$在$T[l..r]$中的哪个串里的出现次数最多，并输出出现次数。

首先把所有的询问离线下来。对 T[] 建立广义后缀自动机，类似 endpos 的维护方式，可以线段树合并地来维护每一个自动机节点对应每一个串的 endpos 数量，这样查询就没有问题了。把这个线段树合并可持久化一下就可以在线地做了，但这里没有必要。为了节约空间和代码复杂度，把每一个询问挂在对应的自动机节点上，这个可以用一次 S 在上面的匹配完成，然后 dfs 整棵 fail 树，实时维护线段树合并的结果，就可以查询答案了。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<cstring>
#include<vector>
#include<iostream>
using namespace std;

const int maxInput=505000;
const int maxN=50500*2;
const int maxAlpha=26;
const int maxBit=20;

class SAM
{
public:
	int son[maxAlpha],len,fail;
};

class Data
{
public:
	int id,cnt;
};

class SegmentData
{
public:
	int ls,rs;Data d;
};

class Question
{
public:
	int ql,qr,l,id;
};

int n,m,Q;
char SS[maxInput],Input[maxInput];
int samcnt=1,lst,root=1,segcnt=0,Rt[maxN],Fa[maxBit][maxN];
SAM Sm[maxN];
SegmentData Sg[maxN*70];
vector<Question> Qn[maxInput];
vector<pair<int,pair<int,int> > > Qs[maxN];
vector<int> T[maxN];
Data Ans[maxInput];

void Insert(int c);
void dfs_sam(int u);
bool operator < (Data A,Data B);
void Modify(int &now,int l,int r,int pos,int key);
Data Query(int now,int l,int r,int ql,int qr);
int Merge(int u,int v,int l,int r);
void Outp(int now,int l,int r);

int main(){
	scanf("%s",SS+1);n=strlen(SS+1);
	scanf("%d",&m);
	for (int i=1;i<=m;i++){
		scanf("%s",Input+1);int len=strlen(Input+1);lst=root;
		for (int j=1;j<=len;j++) Insert(Input[j]-'a'),Modify(Rt[lst],1,m,i,1);
	}
	scanf("%d",&Q);
	for (int i=1;i<=Q;i++){
		int l,r,pl,pr;scanf("%d%d%d%d",&l,&r,&pl,&pr);Ans[i].id=l;
		Qn[pr].push_back((Question){l,r,pl,i});
	}

	for (int i=2;i<=samcnt;i++) Fa[0][i]=Sm[i].fail,T[Sm[i].fail].push_back(i);
	for (int i=1;i<maxBit;i++)
		for (int j=1;j<=samcnt;j++)
			if (Fa[i-1][j]) Fa[i][j]=Fa[i-1][Fa[i-1][j]];
	for (int i=1,now=1,len=0;i<=n;i++){
		while (now&&(Sm[now].son[SS[i]-'a']==0)) now=Sm[now].fail,len=Sm[now].len;
		if (now==0){
			now=1;len=0;continue;
		}
		else now=Sm[now].son[SS[i]-'a'],++len;
		for (int j=0,sz=Qn[i].size();j<sz;j++){
			int qlen=i-Qn[i][j].l+1,u=now;
			if (qlen>len) continue;
			for (int k=maxBit-1;k>=0;k--)
				if ((Fa[k][u])&&(Sm[Fa[k][u]].len>=qlen)) u=Fa[k][u];
			Qs[u].push_back(make_pair(Qn[i][j].id,make_pair(Qn[i][j].ql,Qn[i][j].qr)));
		}
	}
	dfs_sam(root);
	for (int i=1;i<=Q;i++) printf("%d %d\n",Ans[i].id,Ans[i].cnt);
	return 0;
}

void Insert(int c){
	if ((Sm[lst].son[c])&&(Sm[Sm[lst].son[c]].len==Sm[lst].len+1)){
		lst=Sm[lst].son[c];return;
	}
	int np=++samcnt,p=lst;lst=samcnt;Sm[np].len=Sm[p].len+1;
	while (p&&(Sm[p].son[c]==0)) Sm[p].son[c]=np,p=Sm[p].fail;
	if (p==0) Sm[np].fail=root;
	else{
		int q=Sm[p].son[c];
		if (Sm[q].len==Sm[p].len+1) Sm[np].fail=q;
		else{
			int nq=++samcnt;Sm[nq]=Sm[q];Sm[nq].len=Sm[p].len+1;
			Sm[np].fail=Sm[q].fail=nq;
			while (p&&(Sm[p].son[c]==q)) Sm[p].son[c]=nq,p=Sm[p].fail;
		}
	}
	return;
}

void dfs_sam(int u){
	for (int i=0,sz=T[u].size();i<sz;i++) dfs_sam(T[u][i]),Rt[u]=Merge(Rt[u],Rt[T[u][i]],1,m);
	for (int i=0,sz=Qs[u].size();i<sz;i++) Ans[Qs[u][i].first]=Query(Rt[u],1,m,Qs[u][i].second.first,Qs[u][i].second.second);
	return;
}

bool operator < (Data A,Data B){
	if (A.cnt!=B.cnt) return A.cnt<B.cnt;
	return A.id>B.id;
}

void Modify(int &now,int l,int r,int pos,int key){
	if (now==0) now=++segcnt;
	if (l==r){
		Sg[now].d.id=pos;Sg[now].d.cnt++;
		return;
	}
	int mid=(l+r)>>1;
	if (pos<=mid) Modify(Sg[now].ls,l,mid,pos,key);
	else Modify(Sg[now].rs,mid+1,r,pos,key);
	Sg[now].d=max(Sg[Sg[now].ls].d,Sg[Sg[now].rs].d);
	return;
}

Data Query(int now,int l,int r,int ql,int qr){
	if (now==0) return ((Data){ql,0});
	if ((l==ql)&&(r==qr)) return Sg[now].d;
	int mid=(l+r)>>1;
	if (qr<=mid) return Query(Sg[now].ls,l,mid,ql,qr);
	else if (ql>=mid+1) return Query(Sg[now].rs,mid+1,r,ql,qr);
	else return max(Query(Sg[now].ls,l,mid,ql,mid),Query(Sg[now].rs,mid+1,r,mid+1,qr));
}

int Merge(int u,int v,int l,int r){
	if ((u==0)||(v==0)) return u+v;
	if (l==r){
		Sg[u].d.cnt+=Sg[v].d.cnt;return u;
	}
	int mid=(l+r)>>1;
	Sg[u].ls=Merge(Sg[u].ls,Sg[v].ls,l,mid);
	Sg[u].rs=Merge(Sg[u].rs,Sg[v].rs,mid+1,r);
	if (Sg[u].ls) Sg[u].d=max(Sg[u].d,Sg[Sg[u].ls].d);
	if (Sg[u].rs) Sg[u].d=max(Sg[u].d,Sg[Sg[u].rs].d);
	return u;
}

void Outp(int now,int l,int r){
	if (l==r){
		cout<<"["<<Sg[now].d.id<<" "<<Sg[now].d.cnt<<"] ";
		return;
	}
	int mid=(l+r)>>1;
	Outp(Sg[now].ls,l,mid);Outp(Sg[now].rs,mid+1,r);
	return;
}
```