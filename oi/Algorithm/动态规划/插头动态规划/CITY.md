# CITY
[BZOJ3125]

小明和小华要参加NOI，踏上了去X市的火车。  
小明望着窗外的田野，大楼，工厂缓缓后退，在思考着什么。  
这时，对面的小华拿出手机对着他说：“看！我们在这个位置！”  
小明望着手机上显示的地图，城市被接到分割成各个方块，而自己所在的点在慢慢移动。  
他突然意识到自己甚至还没游历过这个自己所在的小城市，学校和家貌以及之间来回的道路似乎成了这个小城的唯一印象。  
若我把它们全部走一圈，可能要仔细计划下吧……不，那么多方案，其实我应该早能做到了吧……小明在心里对自己说。

在要求连通哈密顿回路的基础上加上判断，只有满足回路要求的路径才能计入答案。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=12;
const int inf=2147483647;

int n,m,now;
char Mp[maxN+5][maxN+5];
ll F[2][1600000];
int scnt[2],Seq[2][1600000],P[20];
int tim,Tim[1600000],Pos[1600000];

void Plus(int S,ll key);
bool check(int x,int y);
bool checkx(int x,int y);
bool checky(int x,int y);

int main(){
	P[0]=1;for (int i=1;i<=15;i++) P[i]=P[i-1]*3;
	scanf("%d%d",&n,&m);for (int i=1;i<=n;i++) scanf("%s",Mp[i]+1);
	int lstx=0,lsty=0;ll Ans=0;
	for (int i=n;(i>=1)&&(lstx==0);i--) for (int j=m;(j>=1)&&(lstx==0);j--) if (Mp[i][j]!='#') lstx=i,lsty=j;
	now=0;F[now][1]=1;scnt[now]=1;Seq[now][1]=0;
	for (int i=1;i<=n;i++)
		for (int j=1;j<=m;j++){
			now^=1;scnt[now]=0;++tim;
			for (int l=1;l<=scnt[now^1];l++)
				if (F[now^1][l]){
					int S=Seq[now^1][l],x=S%3,y=S/P[j]%3;ll key=F[now^1][l];
					if (Mp[i][j]=='#'){
						if ((x==0)&&(y==0)) Plus(S,key);
						continue;
					}
					if (x==0){
						if (y==0) if (check(i,j)&&checky(i+1,j)&&checkx(i,j+1)) Plus(S+P[j]+2,key);
						if (y==1){
							if (checky(i,j)&&checky(i+1,j)) Plus(S,key);
							if (check(i,j)&&checkx(i,j+1)) Plus(S-P[j]+1,key);
						}
						if (y==2){
							if (checky(i,j)&&checky(i+1,j)) Plus(S,key);
							if (check(i,j)&&checkx(i,j+1)) Plus(S-P[j]*2+2,key);
						}
					}
					if (x==1){
						if (y==0){
							if (checkx(i,j)&&checkx(i,j+1)) Plus(S,key);
							if (check(i,j)&&checky(i+1,j)) Plus(S-1+P[j],key);
						}
						if (y==1){
							int cnt=0,p=j+1;
							while ((p<=m)&&((cnt!=0)||(S/P[p]%3!=2))){
								if (S/P[p]%3==2) --cnt;
								if (S/P[p]%3==1) ++cnt;
								++p;
							}
							if ((p<=m)&&(check(i,j))) Plus(S-1-P[j]-P[p],key);
						}
						if (y==2){
							if (check(i,j)&&(i==lstx)&&(j==lsty)) Ans+=key;
						}
					}
					if (x==2){
						if (y==0){
							if (checkx(i,j)&&checkx(i,j+1)) Plus(S,key);
							if (check(i,j)&&checky(i+1,j)) Plus(S-2+P[j]*2,key);
						}
						if (y==1){
							if (check(i,j)) Plus(S-2-P[j],key);
						}
						if (y==2){
							int cnt=0,p=j-1;
							while ((p>=1)&&((cnt!=0)||(S/P[p]%3!=1))){
								if (S/P[p]%3==1) --cnt;
								if (S/P[p]%3==2) ++cnt;
								--p;
							}
							if ((p>=1)&&(check(i,j))) Plus(S-2-P[j]*2+P[p],key);
						}
					}
				}
			for (int k=1;k<=scnt[now^1];k++) F[now^1][k]=0;
		}
	printf("%lld\n",Ans);return 0;
}

void Plus(int S,ll key){
	if (Tim[S]!=tim) Seq[now][Pos[S]=++scnt[now]]=S,Tim[S]=tim;
	F[now][Pos[S]]+=key;return;
}

bool check(int x,int y){
	return Mp[x][y]=='.';
}

bool checkx(int x,int y){
	return (Mp[x][y]=='.')||(Mp[x][y]=='-');
}

bool checky(int x,int y){
	return (Mp[x][y]=='.')||(Mp[x][y]=='|');
}
```